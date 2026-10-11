export const groundVertexShader = `
    varying vec2 vWorldXZ;

    void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldXZ = worldPosition.xz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
`;

export const groundFragmentShader = `
    varying vec2 vWorldXZ;

    float hash(vec2 point) {
        return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 point) {
        vec2 cell = floor(point);
        vec2 fraction = smoothstep(0.0, 1.0, fract(point));
        return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), fraction.x),
            mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), fraction.x), fraction.y);
    }

    void main() {
        vec2 gridPosition = vWorldXZ * 1.25;
        vec2 gridWidth = fwidth(gridPosition);
        vec2 grid = 1.0 - smoothstep(gridWidth, gridWidth * 2.2, abs(fract(gridPosition - 0.5) - 0.5));
        float gridLine = max(grid.x, grid.y) * 0.1;
        float terrain = noise(vWorldXZ * 0.23) + noise(vWorldXZ * 0.51) * 0.35;
        float contour = 1.0 - smoothstep(0.025, 0.07, abs(fract(terrain * 8.0) - 0.5));
        float distanceFade = 1.0 - smoothstep(5.0, 16.0, length(vWorldXZ));
        float signal = (gridLine + contour * 0.08) * distanceFade;
        vec3 color = vec3(0.16, 0.52, 0.44);
        gl_FragColor = vec4(color, clamp(signal * 0.9, 0.0, 0.14));
    }
`;

export const hologramVertexShader = `
    varying vec2 vUv;
    uniform float uTime;

    void main() {
        vUv = uv;
        vec3 displaced = position;
        displaced.x += sin(position.y * 24.0 + uTime * 2.0) * 0.006;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
`;

export const hologramFragmentShader = `
    uniform sampler2D uTexture;
    uniform float uTime;
    varying vec2 vUv;

    float hash(vec2 point) {
        return fract(sin(dot(point, vec2(41.0, 289.0))) * 45758.5453);
    }

    void main() {
        float jitter = (hash(vec2(floor(vUv.y * 180.0), floor(uTime * 14.0))) - 0.5) * 0.012;
        vec4 image = texture2D(uTexture, vec2(vUv.x + jitter, vUv.y));
        float scanline = 0.82 + sin(vUv.y * 650.0 + uTime * 7.0) * 0.1;
        vec3 tinted = image.rgb * vec3(0.42, 0.95, 0.88) * scanline;
        gl_FragColor = vec4(tinted, image.a * 0.84);
    }
`;

export const beamVertexShader = `
    varying vec3 vPosition;

    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const beamFragmentShader = `
    uniform float uTime;
    varying vec3 vPosition;

    float hash(vec2 point) {
        return fract(sin(dot(point, vec2(91.7, 263.3))) * 43758.5453);
    }

    void main() {
        float height = 1.0 - clamp((vPosition.y + 0.64) / 1.28, 0.0, 1.0);
        float flicker = 0.84 + hash(vec2(floor(vPosition.y * 36.0), floor(uTime * 12.0))) * 0.16;
        float edgeFade = 1.0 - smoothstep(0.2, 1.0, length(vPosition.xz) / 0.82);
        float alpha = height * edgeFade * flicker * 0.13;
        gl_FragColor = vec4(vec3(0.35, 0.92, 0.82), alpha);
    }
`;
