import { Component, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import SecretsScene from './SecretsScene.jsx';
import { validateAssetManifest } from '../runtime/assetManifest.js';
import { getFrameLoop } from '../runtime/experienceState.js';

class SceneErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { failed: false };
    }

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error) {
        this.props.onError(error);
    }

    render() {
        return this.state.failed ? null : this.props.children;
    }
}

const FrameLoopController = ({ mode, viewKey }) => {
    const { invalidate, setFrameloop } = useThree();

    useEffect(() => {
        setFrameloop(mode);
        if (mode === 'demand') {
            invalidate();
        }
    }, [invalidate, mode, setFrameloop, viewKey]);

    return null;
};

const SceneLoadingStatus = ({ preparing }) => {
    const { active } = useProgress();
    return active || preparing
        ? <div className="secrets-scene-status" role="status">Loading 3D scene…</div>
        : null;
};

const ContextEvents = ({ onError }) => {
    const { gl } = useThree();

    useEffect(() => {
        const canvas = gl.domElement;
        const handleLost = event => {
            event.preventDefault();
            onError(new Error('WebGL context lost'));
        };
        canvas.addEventListener('webglcontextlost', handleLost);
        return () => canvas.removeEventListener('webglcontextlost', handleLost);
    }, [gl, onError]);

    return null;
};

const ScenePreparer = ({ onError, onReady }) => {
    const { camera, gl, scene } = useThree();

    useEffect(() => {
        let cancelled = false;

        Promise.resolve()
            .then(() => gl.compileAsync(scene, camera))
            .then(() => {
                if (!cancelled) {
                    onReady();
                }
            })
            .catch(error => {
                if (!cancelled) {
                    onError(error);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [camera, gl, onError, onReady, scene]);

    return null;
};

const ValidatedCanvas = ({ assetManifest, onError, onReady, selectedProject, selectedProjectImage, ...sceneProps }) => {
    const [prepared, setPrepared] = useState(false);
    const validatedManifest = useMemo(() => validateAssetManifest(assetManifest), [assetManifest]);
    const motionActive = !sceneProps.reducedMotion;
    const requestedFrameLoop = getFrameLoop({
        reducedMotion: sceneProps.reducedMotion,
        visible: sceneProps.visible,
    }, motionActive);
    const frameLoop = prepared ? requestedFrameLoop : 'never';
    const dpr = /** @type {number | [number, number]} */ (
        typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : [1, 1.5]
    );
    const handlePrepared = useCallback(() => {
        setPrepared(true);
        onReady();
    }, [onReady]);

    return (
        <>
            <SceneLoadingStatus preparing={!prepared} />
            <Canvas
                camera={{ fov: 42, near: 0.1, far: 80, position: [0, 1.6, 6] }}
                dpr={dpr}
                frameloop={frameLoop}
                gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
                onCreated={({ gl }) => {
                    const canvas = gl.domElement;
                    gl.toneMappingExposure = 1.12;
                    canvas.setAttribute('aria-hidden', 'true');
                    canvas.tabIndex = -1;
                }}
                shadows
            >
                <FrameLoopController
                    mode={frameLoop}
                    viewKey={`${sceneProps.destination}:${sceneProps.destinationTarget}:${sceneProps.activeTarget}:${selectedProjectImage}`}
                />
                <ContextEvents onError={onError} />
                <Suspense fallback={null}>
                    <SecretsScene
                        {...sceneProps}
                        assetManifest={validatedManifest}
                        selectedProject={selectedProject}
                        selectedProjectImage={selectedProjectImage}
                    />
                    <ScenePreparer onError={onError} onReady={handlePrepared} />
                </Suspense>
            </Canvas>
        </>
    );
};

const SecretsCanvas = props => (
    <SceneErrorBoundary onError={props.onError}>
        <ValidatedCanvas {...props} />
    </SceneErrorBoundary>
);

export default SecretsCanvas;
