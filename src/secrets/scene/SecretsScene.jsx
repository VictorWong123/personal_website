import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, Lightformer, useGLTF } from '@react-three/drei';
import { MathUtils, Vector3 } from 'three';
import AnimatedAsset from './AnimatedAsset.jsx';
import { GroundEffect, ProjectorEffect } from './Effects.jsx';
import {
    advanceFollower,
    clampFrameDelta,
    createPathSampler,
    dampAngle,
    measureWorldSpeed,
    recordPathPosition,
    sampleRecordedPath,
} from '../runtime/journey.js';

const TRAVEL_DURATION = 4;
const DOG_DELAY = 0.55;
const DOG_HISTORY_AGE = 1.5;
const PROJECTOR_POSITION = /** @type {[number, number, number]} */ ([5.5, 0, 3.5]);
const BEACON_POSITION = /** @type {[number, number, number]} */ ([-3.2, 0, 0]);

const WORLD_POSES = /** @type {Record<string, [number, number, number]>} */ ({
    overview: [0, 0, 1.7],
    archive: [3.45, 0, 3.5],
    contact: [-2.5, 0, 0.5],
});

const CAMERA_OFFSETS = /** @type {Record<string, [number, number, number]>} */ ({
    overview: [6, 4.5, 13],
    archive: [-4.3, 2.6, 4.2],
    contact: [1.8, 1.75, 3.2],
});

/** @returns {[number, number, number]} */
const lookTargetFor = (location, position, tabletViewport = false, target = null) => {
    if (target === 'dossier') return [position[0] + 0.35, tabletViewport ? 0.8 : 1.55, position[2]];
    if (target === 'fieldNote') return [position[0] + 0.42, tabletViewport ? 0.24 : 0.55, position[2] - 0.2];
    if (target === 'contact') return [BEACON_POSITION[0], tabletViewport ? 0.45 : 0.9, BEACON_POSITION[2]];
    return [
        position[0] + (location === 'archive' ? (tabletViewport ? 1.25 : 2.3) : location === 'contact' ? -0.5 : 1.8),
        location === 'archive' ? (tabletViewport ? -0.55 : 1.35) : location === 'contact' ? 1.05 : 0.9,
        location === 'overview' ? 1.15 : position[2],
    ];
};

const cameraOffsetFor = (location, tabletViewport, target = null, tabletPortrait = false) => {
    if (target === 'dossier') return tabletViewport ? [0.65, 1.9, 3.2] : [0.35, 1.58, 1.55];
    if (target === 'fieldNote') return tabletViewport ? [1.8, 1.4, 4] : [1.45, 0.95, 2.7];
    if (location === 'overview' && tabletPortrait) return [6, 5.2, 17];
    if (location === 'archive' && tabletViewport) return [-5.6, 3.4, 6.6];
    if (location === 'contact' && tabletViewport) return [2, 2.2, 5];
    return CAMERA_OFFSETS[location];
};

const headingForSection = location => {
    if (location === 'archive') {
        const position = WORLD_POSES.archive;
        return Math.atan2(PROJECTOR_POSITION[0] - position[0], PROJECTOR_POSITION[2] - position[2]);
    }
    return 0;
};

const DiscoveryHotspot = ({ args, disabled, label, onDiscover, position, target }) => {
    const [highlighted, setHighlighted] = useState(false);
    const labelRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
    const setHover = active => {
        if (disabled) return;
        setHighlighted(active);
        document.body.style.cursor = active ? 'pointer' : '';
    };
    useEffect(() => () => {
        document.body.style.cursor = '';
    }, []);

    return (
        <group position={position}>
            <mesh
                onClick={event => {
                    event.stopPropagation();
                    if (!disabled) onDiscover(target, labelRef.current);
                }}
                onPointerDown={event => event.stopPropagation()}
                onPointerOut={() => setHover(false)}
                onPointerOver={event => {
                    event.stopPropagation();
                    setHover(true);
                }}
            >
                <boxGeometry args={args} />
                <meshBasicMaterial colorWrite={false} depthWrite={false} opacity={0} transparent />
            </mesh>
            <mesh position={[0, -position[1] + 0.025, 0]} rotation-x={-Math.PI / 2} visible={highlighted}>
                <ringGeometry args={[args[0] * 0.34, args[0] * 0.48, 32]} />
                <meshBasicMaterial color="#8be8d9" depthWrite={false} opacity={0.62} transparent />
            </mesh>
            <Html center position={[0, args[1] / 2 + 0.2, 0]} zIndexRange={[12, 4]}>
                <button
                    className="secrets-world-label"
                    disabled={disabled}
                    onBlur={() => setHover(false)}
                    onClick={event => onDiscover(target, event.currentTarget)}
                    onFocus={() => setHover(true)}
                    onPointerEnter={() => setHover(true)}
                    onPointerLeave={() => setHover(false)}
                    ref={labelRef}
                    type="button"
                >
                    <span aria-hidden="true" />{label}
                </button>
            </Html>
        </group>
    );
};

const ContactBeacon = ({ disabled, onDiscover }) => (
    <group position={BEACON_POSITION}>
        <mesh castShadow position-y={0.62}>
            <cylinderGeometry args={[0.1, 0.22, 1.24, 8]} />
            <meshStandardMaterial color="#15201f" emissive="#75dccd" emissiveIntensity={0.9} metalness={0.35} roughness={0.35} />
        </mesh>
        <mesh position-y={1.32}>
            <octahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial color="#b9fff5" emissive="#75dccd" emissiveIntensity={3.2} />
        </mesh>
        <pointLight color="#75dccd" intensity={3} position-y={1.3} distance={4} />
        <DiscoveryHotspot args={[1.2, 1.8, 1.2]} disabled={disabled} label="Contact beacon" onDiscover={onDiscover} position={[0, 0.9, 0]} target="contact" />
    </group>
);

/** @returns {[number, number, number]} */
const headingVector = angle => [Math.sin(angle), 0, Math.cos(angle)];

/** @returns {[number, number, number]} */
const dogTargetFor = (position, tangent) => [
    position[0] - tangent[0] * 0.85 + tangent[2] * 0.5,
    0,
    position[2] - tangent[2] * 0.85 - tangent[0] * 0.5,
];

const normalizeAngle = angle => Math.atan2(Math.sin(angle), Math.cos(angle));

const EnvironmentAsset = ({ asset }) => {
    const { scene: sourceScene } = /** @type {import('three-stdlib').GLTF} */ (
        /** @type {unknown} */ (useGLTF(asset.url))
    );
    const scene = useRef(null);
    if (!scene.current) {
        scene.current = sourceScene.clone(true);
        const materialClones = new Map();
        scene.current.traverse(object => {
            if ('isMesh' in object) {
                const mesh = /** @type {import('three').Mesh} */ (object);
                const cloneMaterial = material => {
                    if (!materialClones.has(material)) {
                        materialClones.set(material, material.clone());
                    }
                    return materialClones.get(material);
                };
                mesh.material = Array.isArray(mesh.material)
                    ? mesh.material.map(cloneMaterial)
                    : cloneMaterial(mesh.material);
            }
        });
    }

    useEffect(() => {
        scene.current.traverse(object => {
            if ('isMesh' in object) {
                const mesh = /** @type {import('three').Mesh} */ (object);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach(material => {
                    if (material.name.startsWith('Terrain') || material.name.startsWith('Contour')) {
                        const surface = /** @type {import('three').MeshStandardMaterial} */ (material);
                        surface.color.set(material.name.startsWith('Terrain') ? '#070b0c' : '#0a1212');
                        surface.envMapIntensity = 0;
                        surface.metalness = 0;
                        surface.metalnessMap = null;
                        surface.roughness = 1;
                        surface.roughnessMap = null;
                        surface.needsUpdate = true;
                    }
                });
            }
        });
    }, []);

    return <primitive object={scene.current} scale={asset.scale} />;
};

const StudioLighting = memo(() => (
    <>
        <hemisphereLight color="#b8c9c6" groundColor="#020506" intensity={0.9} />
        <directionalLight
            castShadow
            color="#e8f3ef"
            intensity={2.4}
            position={[-4, 7, 6]}
            shadow-mapSize-height={1024}
            shadow-mapSize-width={1024}
        />
        <directionalLight color="#78b8b0" intensity={0.85} position={[5, 3, 4]} />
        <directionalLight color="#798aa8" intensity={1.1} position={[1, 4, -6]} />
        <Environment environmentIntensity={1.25} frames={1} resolution={128}>
            <Lightformer intensity={4.5} position={[-5, 6, 5]} scale={[5, 5]} target={[0, 1, 0]} />
            <Lightformer color="#9be7dc" intensity={2.4} position={[5, 3, 3]} scale={[3, 5]} target={[0, 1, 0]} />
            <Lightformer color="#8194bb" intensity={2.8} position={[0, 4, -6]} scale={[6, 2]} target={[0, 1, 0]} />
            <Lightformer intensity={1.1} position={[0, -1, 4]} scale={[8, 2]} target={[0, 1, 0]} />
        </Environment>
    </>
));

const TravelerParty = ({
    activeLocation,
    activeTarget,
    assetManifest,
    destination,
    destinationTarget,
    interactionDisabled,
    journeyId,
    onArrivalAnimationComplete,
    onIntroComplete,
    onJourneyComplete,
    onDiscover,
    phase,
    reducedMotion,
}) => {
    const heroGroup = useRef(/** @type {import('three').Group | null} */ (null));
    const dogGroup = useRef(/** @type {import('three').Group | null} */ (null));
    const initialHeading = headingForSection(activeLocation);
    const initialHeroPosition = /** @type {[number, number, number]} */ ([...WORLD_POSES[activeLocation]]);
    const initialDogPosition = dogTargetFor(initialHeroPosition, headingVector(initialHeading));
    const heroPosition = useRef(initialHeroPosition);
    const heroHeading = useRef(initialHeading);
    const heroSpeed = useRef(0);
    const dogSpeed = useRef(0);
    const dogState = useRef({ position: initialDogPosition, speed: 0, arrived: true });
    const dogPosture = useRef(activeLocation === 'archive' ? 'sitting' : 'standing');
    const dogSettledSection = useRef(activeLocation);
    const pathHistory = useRef([]);
    const simulationTime = useRef(0);
    const turning = useRef(false);
    const turnTargetHeading = useRef(initialHeading);
    const dogStanding = useRef(false);
    const travel = useRef({
        completed: true,
        elapsed: 0,
        journeyId,
        sampler: createPathSampler([initialHeroPosition, WORLD_POSES[destination]]),
    });
    const [heroAction, setHeroAction] = useState(phase === 'intro' ? 'intro' : 'idle');
    const [dogAction, setDogAction] = useState(activeLocation === 'overview' ? 'look' : 'idle');
    const dogActionRef = useRef(dogAction);
    dogActionRef.current = dogAction;
    const { camera, size } = useThree();
    const tabletPortrait = size.width >= 701 && size.width <= 900 && size.height > size.width;
    const tabletViewport = size.width >= 701 && size.width <= 1100;
    const viewTarget = phase === 'ready' ? activeTarget : destinationTarget;
    const cameraTarget = useRef(new Vector3(...lookTargetFor(activeLocation, initialHeroPosition, tabletViewport, viewTarget)));

    const getExpectedSpeed = useCallback(() => {
        const pathDistance = new Vector3(...heroPosition.current).distanceTo(new Vector3(...WORLD_POSES[destination]));
        return pathDistance / TRAVEL_DURATION;
    }, [destination]);

    const setHeroTravelGait = useCallback(() => {
        setHeroAction(getExpectedSpeed() > 1.7 ? 'run' : 'walk');
    }, [getExpectedSpeed]);

    const setDogMotion = useCallback(action => {
        dogActionRef.current = action;
        setDogAction(action);
    }, []);

    const setDogTravelGait = useCallback(() => {
        setDogMotion(dogSpeed.current > 1.35 ? 'run' : 'walk');
    }, [setDogMotion]);

    useEffect(() => {
        if (phase === 'intro') {
            setHeroAction('intro');
            setDogMotion('look');
            return;
        }

        if (phase === 'traveling') {
            const interruptedTravel = !travel.current.completed && travel.current.journeyId !== journeyId;
            const from = [...heroPosition.current];
            const to = WORLD_POSES[destination];
            const midpoint = [(from[0] + to[0]) / 2, 0, (from[2] + to[2]) / 2 + 0.8];
            const sampler = createPathSampler([from, midpoint, to]);
            const firstTangent = sampler(0).tangent;
            const targetHeading = Math.atan2(firstTangent[0], firstTangent[2]);
            const turn = normalizeAngle(targetHeading - heroHeading.current);
            turnTargetHeading.current = targetHeading;
            travel.current = { completed: false, elapsed: 0, journeyId, sampler };
            dogSettledSection.current = null;
            pathHistory.current = [{
                position: dogTargetFor(from, headingVector(heroHeading.current)),
                time: simulationTime.current,
            }];
            turning.current = !interruptedTravel && Math.abs(turn) > 0.18;
            if (turning.current) {
                setHeroAction(turn > 0 ? 'turnRight' : 'turnLeft');
            } else {
                setHeroTravelGait();
            }

            if (dogPosture.current === 'sitting') {
                dogStanding.current = true;
                setDogMotion('stand');
            } else {
                setDogTravelGait();
            }
            return;
        }

        if (phase === 'arriving') {
            setHeroAction('arrive');
            return;
        }

        if (phase === 'ready') {
            setHeroAction('idle');
            if (!dogState.current.arrived) {
                setDogTravelGait();
            } else {
                dogSettledSection.current = destination;
                if (destination === 'archive') {
                    dogPosture.current = 'sitting';
                    setDogMotion('sit');
                } else {
                    dogPosture.current = 'standing';
                    setDogMotion(destination === 'overview' ? 'look' : 'idle');
                }
            }
        }
    }, [destination, journeyId, phase, setDogMotion, setDogTravelGait, setHeroTravelGait]);

    useLayoutEffect(() => {
        if (!reducedMotion) {
            return;
        }

        const position = WORLD_POSES[destination];
        const heading = headingForSection(destination);
        const dogPosition = dogTargetFor(position, headingVector(heading));
        heroPosition.current = [...position];
        heroHeading.current = heading;
        heroSpeed.current = 0;
        dogState.current = { position: dogPosition, speed: 0, arrived: true };
        dogSpeed.current = 0;
        heroGroup.current?.position.fromArray(position);
        if (heroGroup.current) {
            heroGroup.current.rotation.y = heading;
        }
        dogGroup.current?.position.fromArray(dogPosition);
        const cameraPosition = new Vector3(...position).add(new Vector3(...cameraOffsetFor(destination, tabletViewport, viewTarget, tabletPortrait)));
        cameraTarget.current.fromArray(lookTargetFor(destination, position, tabletViewport, viewTarget));
        camera.position.copy(cameraPosition);
        camera.lookAt(cameraTarget.current);
    }, [camera, destination, reducedMotion, tabletPortrait, tabletViewport, viewTarget]);

    useFrame((_, rawDelta) => {
        if (reducedMotion) {
            return;
        }

        const delta = clampFrameDelta(rawDelta);
        simulationTime.current += delta;
        let tangent = headingVector(heroHeading.current);

        if (phase === 'traveling' && turning.current) {
            heroHeading.current = dampAngle(heroHeading.current, turnTargetHeading.current, 4.5, delta);
            tangent = headingVector(heroHeading.current);
            heroSpeed.current = 0;
        } else if (phase === 'traveling') {
            travel.current.elapsed = Math.min(TRAVEL_DURATION, travel.current.elapsed + delta);
            const rawProgress = travel.current.elapsed / TRAVEL_DURATION;
            const sampled = travel.current.sampler(MathUtils.smootherstep(rawProgress, 0, 1));
            const previous = heroPosition.current;
            heroSpeed.current = measureWorldSpeed(previous, sampled.position, delta);
            heroPosition.current = sampled.position;
            const pathHeading = Math.atan2(sampled.tangent[0], sampled.tangent[2]);
            heroHeading.current = dampAngle(heroHeading.current, pathHeading, 10, delta);
            tangent = headingVector(heroHeading.current);

            if (rawProgress >= 1 && !travel.current.completed) {
                travel.current.completed = true;
                heroSpeed.current = 0;
                onJourneyComplete(travel.current.journeyId);
            }
        } else {
            heroSpeed.current = 0;
            heroHeading.current = dampAngle(heroHeading.current, headingForSection(destination), 4.5, delta);
            tangent = headingVector(heroHeading.current);
        }

        if (heroGroup.current) {
            heroGroup.current.position.fromArray(heroPosition.current);
            heroGroup.current.rotation.y = heroHeading.current;
        }

        const desiredDogPosition = dogTargetFor(heroPosition.current, tangent);
        pathHistory.current = recordPathPosition(pathHistory.current, {
            position: desiredDogPosition,
            time: simulationTime.current,
        }, DOG_HISTORY_AGE);
        const dogTarget = sampleRecordedPath(pathHistory.current, simulationTime.current - DOG_DELAY);

        if (dogTarget && !dogStanding.current) {
            const previousDogPosition = dogState.current.position;
            dogState.current = advanceFollower(dogState.current, dogTarget, delta, {
                maxSpeed: Math.max(2.8, heroSpeed.current * 1.32),
            });
            dogSpeed.current = measureWorldSpeed(previousDogPosition, dogState.current.position, delta);
            if (['run', 'walk'].includes(dogActionRef.current)) {
                if (dogActionRef.current === 'walk' && dogSpeed.current > 1.35) {
                    setDogMotion('run');
                } else if (dogActionRef.current === 'run' && dogSpeed.current < 1.05) {
                    setDogMotion('walk');
                }
            }
        } else {
            dogSpeed.current = 0;
        }

        if (dogGroup.current) {
            const previousDogPosition = dogGroup.current.position.clone();
            dogGroup.current.position.fromArray(dogState.current.position);
            const dogHeading = new Vector3().subVectors(dogGroup.current.position, previousDogPosition);
            if (dogHeading.lengthSq() > 0.00001) {
                dogGroup.current.rotation.y = Math.atan2(dogHeading.x, dogHeading.z);
            }
        }

        if (phase === 'ready' && dogState.current.arrived && dogSettledSection.current !== destination) {
            dogSettledSection.current = destination;
            if (destination === 'archive') {
                dogPosture.current = 'sitting';
                setDogMotion('sit');
            } else {
                dogPosture.current = 'standing';
                setDogMotion(destination === 'overview' ? 'look' : 'idle');
            }
        }

        let desiredCamera;
        if (phase === 'traveling') {
            const behind = new Vector3(-tangent[0] * 4.2 - tangent[2] * 0.5, 2.1, -tangent[2] * 4.2 + tangent[0] * 0.5);
            desiredCamera = new Vector3(...heroPosition.current).add(behind);
        } else {
            const offset = phase === 'intro'
                ? [0, 1.55, 1.65]
                : cameraOffsetFor(destination, tabletViewport, viewTarget, tabletPortrait);
            desiredCamera = new Vector3(...heroPosition.current).add(new Vector3(...offset));
        }
        camera.position.lerp(desiredCamera, 1 - Math.exp(-delta * 3.5));
        const desiredTarget = phase === 'traveling'
            ? new Vector3(heroPosition.current[0], 1, heroPosition.current[2])
            : phase === 'intro'
                ? new Vector3(heroPosition.current[0], 1.58, heroPosition.current[2])
                : new Vector3(...lookTargetFor(destination, heroPosition.current, tabletViewport, viewTarget));
        cameraTarget.current.lerp(desiredTarget, 1 - Math.exp(-delta * 4.5));
        camera.lookAt(cameraTarget.current);
    }, -1);

    const handleHeroFinished = action => {
        if (action === 'intro') {
            onIntroComplete();
        } else if (action === 'turnLeft' || action === 'turnRight') {
            turning.current = false;
            setHeroTravelGait();
        } else if (action === 'arrive') {
            onArrivalAnimationComplete(journeyId);
        }
    };

    const handleDogFinished = action => {
        if (action === 'stand') {
            dogPosture.current = 'standing';
            dogStanding.current = false;
            setDogTravelGait();
        }
    };

    return (
        <>
            <group position={initialHeroPosition} ref={heroGroup} rotation-y={initialHeading}>
                <AnimatedAsset
                    actionName={heroAction}
                    asset={assetManifest.hero}
                    onActionFinished={handleHeroFinished}
                    reducedMotion={reducedMotion}
                    worldSpeedRef={heroSpeed}
                />
                <DiscoveryHotspot args={[1.35, 2.1, 1.1]} disabled={interactionDisabled} label="Robot dossier" onDiscover={onDiscover} position={[0, 1.05, 0]} target="dossier" />
            </group>
            <group
                position={initialDogPosition}
                ref={dogGroup}
            >
                <AnimatedAsset
                    actionName={dogAction}
                    asset={assetManifest.dog}
                    onActionFinished={handleDogFinished}
                    reducedMotion={reducedMotion}
                    worldSpeedRef={dogSpeed}
                />
                <DiscoveryHotspot args={[1.25, 0.9, 1.4]} disabled={interactionDisabled} label="Companion note" onDiscover={onDiscover} position={[0, 0.45, 0]} target="fieldNote" />
            </group>
        </>
    );
};

const SecretsScene = props => {
    const { assetManifest, interactionDisabled, onDiscover, selectedProject, selectedProjectImage } = props;

    return (
        <>
            <color attach="background" args={['#030608']} />
            <fog attach="fog" args={['#030608', 18, 36]} />
            <StudioLighting />
            <pointLight color="#79e6d7" intensity={5} position={PROJECTOR_POSITION} />
            <EnvironmentAsset asset={assetManifest.environment} />
            <mesh position-y={-0.012} receiveShadow rotation-x={-Math.PI / 2}>
                <planeGeometry args={[60, 45]} />
                <meshStandardMaterial color="#030607" metalness={0} roughness={1} />
            </mesh>
            <GroundEffect />
            <ProjectorEffect imageUrl={selectedProjectImage} project={selectedProject} />
            <DiscoveryHotspot args={[2.2, 1.7, 2.2]} disabled={interactionDisabled} label="Project archive" onDiscover={onDiscover} position={[5.5, 0.85, 3.5]} target="archive" />
            <ContactBeacon disabled={interactionDisabled} onDiscover={onDiscover} />
            <TravelerParty {...props} />
        </>
    );
};

export default SecretsScene;
