import { Component, Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { AdditiveBlending, CanvasTexture, DoubleSide, SRGBColorSpace } from 'three';
import {
    beamFragmentShader,
    beamVertexShader,
    groundFragmentShader,
    groundVertexShader,
    hologramFragmentShader,
    hologramVertexShader,
} from './shaders.js';

export const GroundEffect = () => {
    const uniforms = useMemo(() => ({}), []);

    return (
        <mesh position-y={0.008} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[30, 22, 1, 1]} />
            <shaderMaterial
                fragmentShader={groundFragmentShader}
                depthWrite={false}
                transparent
                uniforms={uniforms}
                vertexShader={groundVertexShader}
            />
        </mesh>
    );
};

const HologramSurface = ({ texture }) => {
    const mesh = useRef(/** @type {import('three').Mesh | null} */ (null));
    const { camera } = useThree();
    const aspect = texture.image?.width && texture.image?.height
        ? texture.image.width / texture.image.height
        : 16 / 9;
    const uniforms = useMemo(() => ({
        uTexture: { value: texture },
        uTime: { value: 0 },
    }), [texture]);

    useFrame((_, delta) => {
        uniforms.uTime.value += delta;
        mesh.current?.lookAt(camera.position);
    });

    return (
        <mesh position={[5.5, 1.28, 3.5]} ref={mesh}>
            <planeGeometry args={[2, 2 / aspect, 20, 12]} />
            <shaderMaterial
                blending={AdditiveBlending}
                depthWrite={false}
                fragmentShader={hologramFragmentShader}
                side={DoubleSide}
                transparent
                uniforms={uniforms}
                vertexShader={hologramVertexShader}
            />
        </mesh>
    );
};

const HologramImage = ({ url }) => <HologramSurface texture={useTexture(url)} />;

const HologramTypography = ({ project }) => {
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 576;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = 'rgba(130, 236, 218, 0.45)';
        context.strokeRect(34, 34, 956, 508);
        context.fillStyle = '#d8fff8';
        context.font = '500 66px monospace';
        context.fillText(project.title.toUpperCase(), 76, 276, 870);
        context.fillStyle = 'rgba(216, 255, 248, 0.65)';
        context.font = '28px monospace';
        context.fillText(project.category.toUpperCase(), 78, 336, 860);
        const canvasTexture = new CanvasTexture(canvas);
        canvasTexture.colorSpace = SRGBColorSpace;
        return canvasTexture;
    }, [project.category, project.title]);

    useEffect(() => () => texture.dispose(), [texture]);

    return <HologramSurface texture={texture} />;
};

const ProjectorBeam = () => {
    const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
    useFrame((_, delta) => {
        uniforms.uTime.value += delta;
    });

    return (
        <mesh position={[5.5, 0.64, 3.5]} rotation-x={Math.PI}>
            <coneGeometry args={[0.82, 1.28, 32, 1, true]} />
            <shaderMaterial
                blending={AdditiveBlending}
                depthWrite={false}
                fragmentShader={beamFragmentShader}
                side={DoubleSide}
                transparent
                uniforms={uniforms}
                vertexShader={beamVertexShader}
            />
        </mesh>
    );
};

class HologramErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { failed: false };
    }

    static getDerivedStateFromError() {
        return { failed: true };
    }

    render() {
        return this.state.failed ? this.props.fallback : this.props.children;
    }
}

const HologramMedia = ({ imageUrl, project }) => {
    const fallback = <HologramTypography project={project} />;

    if (!imageUrl) {
        return fallback;
    }

    return (
        <HologramErrorBoundary fallback={fallback} key={imageUrl}>
            <Suspense fallback={fallback}>
                <HologramImage url={imageUrl} />
            </Suspense>
        </HologramErrorBoundary>
    );
};

export const ProjectorEffect = ({ imageUrl, project }) => (
    <group>
        <ProjectorBeam />
        <HologramMedia imageUrl={imageUrl} project={project} />
    </group>
);
