import test from 'node:test';
import assert from 'node:assert/strict';
import {
    MAX_FRAME_DELTA,
    advanceFollower,
    clampFrameDelta,
    createPathSampler,
    dampAngle,
    locomotionTimeScale,
    measureWorldSpeed,
    recordPathPosition,
    samplePath,
    sampleRecordedPath,
} from './journey.js';

test('path progress follows distance across unequal segments', () => {
    const sample = samplePath([[0, 0, 0], [1, 0, 0], [1, 0, 3]], 0.5);
    assert.ok(sample.position[0] > 0.8);
    assert.ok(sample.position[2] > 0.5 && sample.position[2] < 1.5);
});

test('smooth path changes heading continuously around its midpoint', () => {
    const sample = createPathSampler([[0, 0, 0], [1, 0, 1], [2, 0, 1]]);
    const before = sample(0.49).tangent;
    const after = sample(0.51).tangent;
    assert.ok(Math.hypot(before[0] - after[0], before[2] - after[2]) < 0.2);
});

test('locomotion time scale matches world speed to full-cycle stride', () => {
    assert.ok(Math.abs(locomotionTimeScale(1.2, 0.8, 1) - 1.5) <= Number.EPSILON);
});

test('world speed comes from actual frame displacement', () => {
    assert.equal(measureWorldSpeed([0, 0, 0], [0.03, 0, 0.04], 0.05), 1);
});

test('angle damping takes the short path across the wrap boundary', () => {
    const current = Math.PI - 0.1;
    const next = dampAngle(current, -Math.PI + 0.1, 8, 0.05);
    assert.ok(next > current);
    assert.ok(next - current < 0.2);
});

test('recorded path interpolates a delayed target and discards old history', () => {
    let history = [];
    history = recordPathPosition(history, { time: 0, position: [0, 0, 0] });
    history = recordPathPosition(history, { time: 1, position: [2, 0, 0] });
    history = recordPathPosition(history, { time: 3, position: [5, 0, 0] });

    assert.deepEqual(sampleRecordedPath(history, 2), [3.5, 0, 0]);
    assert.equal(history[0].time, 1);
});

test('follower clamps large frames and approaches without teleporting', () => {
    const next = advanceFollower({ position: [0, 0, 0], speed: 0 }, [10, 0, 0], 1);
    assert.equal(clampFrameDelta(1), MAX_FRAME_DELTA);
    assert.ok(next.position[0] > 0 && next.position[0] < 0.1);
    assert.equal(next.arrived, false);
});

test('follower decelerates by a bounded amount and never overshoots', () => {
    const delta = 0.04;
    const next = advanceFollower(
        { position: [0, 0, 0], speed: 2 },
        [0.02, 0, 0],
        delta,
        { deceleration: 5 },
    );

    assert.ok(2 - next.speed <= 5 * delta + Number.EPSILON);
    assert.ok(next.position[0] <= 0.02);
    assert.equal(next.arrived, false);
});

test('follower settles at its target with bounded braking', () => {
    const delta = 0.02;
    let follower = { position: [0, 0, 0], speed: 2 };

    for (let frame = 0; frame < 200 && !follower.arrived; frame += 1) {
        const previousSpeed = follower.speed;
        follower = advanceFollower(follower, [0.5, 0, 0], delta, { deceleration: 5 });
        assert.ok(previousSpeed - follower.speed <= 5 * delta + Number.EPSILON);
        assert.ok(follower.position[0] <= 0.5);
    }

    assert.equal(follower.arrived, true);
    assert.deepEqual(follower.position, [0.5, 0, 0]);
    assert.equal(follower.speed, 0);
});

test('recorded history remains bounded during a long idle', () => {
    let history = [];

    for (let time = 0; time <= 30; time += 0.05) {
        history = recordPathPosition(history, { time, position: [1, 0, 1] }, 2);
    }

    assert.ok(history.length <= 42);
    assert.ok(history[0].time > 27.8);
});

test('recorded history replaces duplicate timestamps', () => {
    let history = recordPathPosition([], { time: 1, position: [0, 0, 0] });
    history = recordPathPosition(history, { time: 1, position: [1, 0, 0] });
    assert.deepEqual(history, [{ time: 1, position: [1, 0, 0] }]);
});
