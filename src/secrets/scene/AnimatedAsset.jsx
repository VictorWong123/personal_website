import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { AnimationMixer, LoopOnce, LoopRepeat } from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { clampFrameDelta, locomotionTimeScale } from '../runtime/journey.js';

const oneShotActions = new Set(['intro', 'arrive', 'sit', 'stand', 'turnLeft', 'turnRight']);

const AnimatedAsset = ({
    actionName,
    asset,
    onActionFinished,
    reducedMotion = false,
    worldSpeedRef,
    ...groupProps
}) => {
    const { scene, animations } = /** @type {import('three-stdlib').GLTF} */ (
        /** @type {unknown} */ (useGLTF(asset.url))
    );
    const root = useMemo(() => {
        const clonedRoot = SkeletonUtils.clone(scene);
        const materialClones = new Map();
        const cloneMaterial = material => {
            if (!materialClones.has(material)) {
                materialClones.set(material, material.clone());
            }
            return materialClones.get(material);
        };

        clonedRoot.traverse(object => {
            if ('isMesh' in object) {
                const mesh = /** @type {import('three').Mesh} */ (object);
                mesh.material = Array.isArray(mesh.material)
                    ? mesh.material.map(cloneMaterial)
                    : cloneMaterial(mesh.material);
            }
        });
        return clonedRoot;
    }, [scene]);
    const mixer = useMemo(() => new AnimationMixer(root), [root]);
    const activeAction = useRef(null);
    const finishedCallback = useRef(onActionFinished);
    finishedCallback.current = onActionFinished;
    const clipName = asset.clips[actionName];
    const clip = useMemo(() => {
        const matchingClip = animations.find(animation => animation.name === clipName);
        if (!matchingClip) {
            throw new Error(`Missing animation clip ${clipName} in ${asset.url}`);
        }
        return matchingClip;
    }, [animations, asset.url, clipName]);

    useEffect(() => {
        root.traverse(object => {
            if ('isMesh' in object) {
                const mesh = /** @type {import('three').Mesh} */ (object);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach(material => {
                    const emissiveMaterial = /** @type {import('three').MeshStandardMaterial} */ (material);
                    if ('emissiveIntensity' in emissiveMaterial && emissiveMaterial.emissiveIntensity > 1.15) {
                        emissiveMaterial.emissiveIntensity = 1.15;
                    }
                });
            }
        });
    }, [root]);

    useEffect(() => {
        const action = mixer.clipAction(clip);
        action.reset();
        action.enabled = true;
        action.clampWhenFinished = oneShotActions.has(actionName);
        action.setEffectiveWeight(1);
        action.setEffectiveTimeScale(1);

        if (oneShotActions.has(actionName)) {
            action.setLoop(LoopOnce, 1);
        } else {
            action.setLoop(LoopRepeat, Infinity);
        }

        if (activeAction.current && activeAction.current !== action) {
            activeAction.current.crossFadeTo(action, 0.24, false);
        }

        action.play();
        mixer.update(0);
        activeAction.current = action;
    }, [actionName, clip, mixer]);

    useEffect(() => {
        const handleFinished = event => {
            if (event.action === activeAction.current) {
                finishedCallback.current?.(actionName);
            }
        };
        mixer.addEventListener('finished', handleFinished);
        return () => mixer.removeEventListener('finished', handleFinished);
    }, [actionName, mixer]);

    useEffect(() => () => {
        mixer.stopAllAction();
        mixer.uncacheRoot(root);
        const materials = new Set();
        root.traverse(object => {
            if ('isMesh' in object) {
                const material = /** @type {import('three').Mesh} */ (object).material;
                (Array.isArray(material) ? material : [material]).forEach(item => materials.add(item));
            }
        });
        materials.forEach(material => material.dispose());
    }, [mixer, root]);

    useFrame((_, delta) => {
        if (reducedMotion) {
            return;
        }

        if (activeAction.current && ['walk', 'run'].includes(actionName)) {
            activeAction.current.setEffectiveTimeScale(locomotionTimeScale(
                worldSpeedRef?.current ?? 0,
                asset.strides[actionName],
                clip.duration,
            ));
        }

        mixer.update(clampFrameDelta(delta));
    });

    const forwardRotation = Math.atan2(asset.forward[0], asset.forward[2]);

    return (
        <group {...groupProps} scale={asset.scale} rotation-y={forwardRotation}>
            <primitive object={root} />
        </group>
    );
};

export default AnimatedAsset;
