import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAssetManifest } from './assetManifest.js';

const character = clips => ({
    clips,
    forward: [0, 0, 1],
    scale: 1,
    strides: { run: 1, walk: 0.5 },
    url: '/asset.glb',
});

const dogClips = {
    idle: 'idle',
    look: 'look',
    run: 'run',
    sit: 'sit',
    stand: 'stand',
    walk: 'walk',
};

test('manifest rejects a missing hero intro clip before any asset loads', () => {
    const manifest = {
        dog: character(dogClips),
        environment: { scale: 1, url: '/environment.glb' },
        hero: character({
            arrive: 'arrive',
            idle: 'idle',
            run: 'run',
            turnLeft: 'turnLeft',
            turnRight: 'turnRight',
            walk: 'walk',
        }),
    };

    assert.throws(() => validateAssetManifest(manifest), /missing the intro clip/);
});
