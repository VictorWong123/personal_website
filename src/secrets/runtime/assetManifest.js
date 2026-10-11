const requiredHeroClips = ['idle', 'intro', 'walk', 'run', 'turnLeft', 'turnRight', 'arrive'];
const requiredDogClips = ['idle', 'walk', 'run', 'sit', 'stand', 'look'];

export const secretsAssetManifest = {
    environment: {
        url: '/secrets/models/terrain-projector.glb',
        scale: 1,
    },
    hero: {
        url: '/secrets/models/hooded-robot.glb',
        scale: 1,
        forward: [0, 0, 1],
        clips: {
            idle: 'idle',
            intro: 'intro',
            walk: 'walk',
            run: 'run',
            turnLeft: 'turnLeft',
            turnRight: 'turnRight',
            arrive: 'arrive',
        },
        strides: {
            walk: 0.88,
            run: 1.1,
        },
    },
    dog: {
        url: '/secrets/models/robot-dog.glb',
        scale: 1,
        forward: [0, 0, 1],
        clips: {
            idle: 'idle',
            walk: 'walk',
            run: 'run',
            sit: 'sit',
            stand: 'stand',
            look: 'look',
        },
        strides: {
            walk: 0.27,
            run: 0.38,
        },
    },
};

export const projectCaptureUrls = {
    FlexFlow: '/secrets/project-captures/flexflow-public.jpg',
    strengthOS: '/secrets/project-captures/strengthos-public.jpg',
    Orbits: '/secrets/project-captures/orbits-public.jpg',
    ShopNSplit: '/secrets/project-captures/shopnsplit-public.jpg',
};

const validateCharacter = (name, asset, requiredClips) => {
    if (!asset?.url || !Number.isFinite(asset.scale) || !Array.isArray(asset.forward)) {
        throw new Error(`${name} needs an explicit url, scale, and forward vector`);
    }

    requiredClips.forEach(clip => {
        if (!asset.clips?.[clip]) {
            throw new Error(`${name} is missing the ${clip} clip mapping`);
        }
    });

    ['walk', 'run'].forEach(gait => {
        if (!(asset.strides?.[gait] > 0)) {
            throw new Error(`${name} needs a positive ${gait} full-cycle stride`);
        }
    });
};

export const validateAssetManifest = manifest => {
    if (!manifest?.environment?.url || !Number.isFinite(manifest.environment.scale)) {
        throw new Error('Environment needs an explicit url and scale');
    }

    validateCharacter('Hero', manifest.hero, requiredHeroClips);
    validateCharacter('Dog', manifest.dog, requiredDogClips);
    return manifest;
};
