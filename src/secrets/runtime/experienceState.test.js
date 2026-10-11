import test from 'node:test';
import assert from 'node:assert/strict';
import { createExperienceState, getFrameLoop, reduceExperience } from './experienceState.js';

const readyState = () => {
    let state = reduceExperience(createExperienceState({ awaitAssets: true }), { type: 'SCENE_READY' });
    return reduceExperience(state, { type: 'INTRO_SKIP' });
};

test('camera-only discoveries open immediately at the current location', () => {
    const state = reduceExperience(readyState(), { type: 'DISCOVER', target: 'dossier' });
    assert.equal(state.activeTarget, 'dossier');
    assert.equal(state.activeLocation, 'overview');
    assert.equal(state.phase, 'ready');
});

test('latest traveling discovery wins and stale arrivals cannot reveal content', () => {
    let state = reduceExperience(readyState(), { type: 'DISCOVER', target: 'archive' });
    const staleJourneyId = state.journeyId;
    state = reduceExperience(state, { type: 'DISCOVER', target: 'contact' });
    state = reduceExperience(state, { type: 'ARRIVE', journeyId: staleJourneyId });
    assert.equal(state.destinationTarget, 'contact');
    assert.equal(state.activeTarget, null);
    assert.equal(state.phase, 'traveling');

    state = reduceExperience(state, { type: 'ARRIVE', journeyId: state.journeyId });
    assert.equal(state.activeTarget, 'contact');
    assert.equal(state.phase, 'arriving');
    state = reduceExperience(state, { type: 'ARRIVAL_COMPLETE', journeyId: state.journeyId });
    assert.equal(state.phase, 'ready');
});

test('selecting before scene readiness preserves the target and skips intro', () => {
    let state = createExperienceState({ awaitAssets: true });
    state = reduceExperience(state, { type: 'DISCOVER', target: 'archive' });
    assert.equal(state.destinationTarget, 'archive');
    assert.equal(state.phase, 'loading');
    state = reduceExperience(state, { type: 'SCENE_READY' });
    assert.equal(state.activeTarget, 'archive');
    assert.equal(state.phase, 'ready');
});

test('closing during travel cancels the pending reveal and stale completion', () => {
    let state = reduceExperience(readyState(), { type: 'DISCOVER', target: 'archive' });
    const cancelledJourney = state.journeyId;
    state = reduceExperience(state, { type: 'CLOSE_DISCOVERY' });
    assert.equal(state.destinationTarget, null);
    assert.equal(state.activeTarget, null);
    assert.equal(state.destination, 'overview');
    state = reduceExperience(state, { type: 'ARRIVE', journeyId: cancelledJourney });
    assert.equal(state.activeTarget, null);
});

test('reduced motion toggled during travel reveals the latest target', () => {
    let state = reduceExperience(readyState(), { type: 'DISCOVER', target: 'archive' });
    state = reduceExperience(state, { type: 'DISCOVER', target: 'contact' });
    state = reduceExperience(state, { type: 'MOTION_CHANGE', reducedMotion: true });
    assert.equal(state.activeLocation, 'contact');
    assert.equal(state.activeTarget, 'contact');
    assert.equal(state.phase, 'ready');
});

test('scene failure with a pending discovery exposes matching HTML content', () => {
    let state = reduceExperience(readyState(), { type: 'DISCOVER', target: 'archive' });
    state = reduceExperience(state, { type: 'SCENE_FAILURE' });
    assert.equal(state.activeLocation, 'archive');
    assert.equal(state.activeTarget, 'archive');
    assert.equal(state.phase, 'ready');
    assert.equal(state.sceneAvailable, false);
});

test('rapid archive dossier contact selection exposes only the latest target', () => {
    let state = reduceExperience(readyState(), { type: 'DISCOVER', target: 'archive' });
    state = reduceExperience(state, { type: 'DISCOVER', target: 'dossier' });
    state = reduceExperience(state, { type: 'DISCOVER', target: 'contact' });
    assert.equal(state.destinationTarget, 'contact');
    assert.equal(state.activeTarget, null);
    state = reduceExperience(state, { type: 'ARRIVE', journeyId: state.journeyId });
    assert.equal(state.activeTarget, 'contact');
});

test('hidden canvases stop frames and static views render on demand', () => {
    assert.equal(getFrameLoop({ visible: false, reducedMotion: false }, true), 'never');
    assert.equal(getFrameLoop({ visible: true, reducedMotion: true }, true), 'demand');
    assert.equal(getFrameLoop({ visible: true, reducedMotion: false }, false), 'demand');
    assert.equal(getFrameLoop({ visible: true, reducedMotion: false }, true), 'always');
});
