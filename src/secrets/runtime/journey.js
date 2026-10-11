import { CatmullRomCurve3, Vector3 } from 'three';

export const MAX_FRAME_DELTA = 1 / 20;

const distance = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);

const lerpPoint = (a, b, amount) => a.map((value, index) => value + (b[index] - value) * amount);

export const clampFrameDelta = delta => Math.min(Math.max(delta, 0), MAX_FRAME_DELTA);

export const locomotionTimeScale = (worldSpeed, stride, clipDuration) => {
    if (worldSpeed < 0 || stride <= 0 || clipDuration <= 0) {
        throw new Error('Locomotion values must use non-negative speed and positive stride and duration');
    }

    return worldSpeed * clipDuration / stride;
};

export const measureWorldSpeed = (previous, current, delta) => (
    delta > 0 ? distance(previous, current) / delta : 0
);

export const dampAngle = (current, target, smoothing, delta) => {
    const shortestTurn = Math.atan2(Math.sin(target - current), Math.cos(target - current));
    return current + shortestTurn * (1 - Math.exp(-smoothing * clampFrameDelta(delta)));
};

export const createPathSampler = points => {
    if (points.length < 2) {
        throw new Error('A journey path needs at least two points');
    }

    const curvePoints = points.length === 2
        ? [points[0], lerpPoint(points[0], points[1], 0.5), points[1]]
        : points;
    const curve = new CatmullRomCurve3(curvePoints.map(point => new Vector3(...point)), false, 'centripetal');
    curve.arcLengthDivisions = 160;

    return progress => {
        const amount = Math.min(Math.max(progress, 0), 1);
        return {
            position: curve.getPointAt(amount).toArray(),
            tangent: curve.getTangentAt(amount).normalize().toArray(),
        };
    };
};

export const samplePath = (points, progress) => createPathSampler(points)(progress);

export const recordPathPosition = (history, sample, maxAge = 2) => {
    const next = history.at(-1)?.time >= sample.time
        ? [...history.slice(0, -1), sample]
        : [...history, sample];
    const cutoff = sample.time - maxAge;
    const firstFresh = next.findIndex(entry => entry.time >= cutoff);
    const keepIndex = firstFresh > 0 && next[firstFresh].time === cutoff ? firstFresh : firstFresh - 1;

    return keepIndex > 0 ? next.slice(keepIndex) : next;
};

export const sampleRecordedPath = (history, time) => {
    if (!history.length) {
        return null;
    }

    if (time <= history[0].time) {
        return history[0].position;
    }

    for (let index = 1; index < history.length; index += 1) {
        if (time <= history[index].time) {
            const previous = history[index - 1];
            const next = history[index];
            const duration = next.time - previous.time;
            return lerpPoint(previous.position, next.position, duration ? (time - previous.time) / duration : 1);
        }
    }

    return history.at(-1).position;
};

export const advanceFollower = ({ position, speed }, target, delta, {
    acceleration = 3.5,
    deceleration = 5,
    maxSpeed = 3.2,
    stopDistance = 0.04,
} = {}) => {
    const frameDelta = clampFrameDelta(delta);
    const remaining = distance(position, target);
    const stoppingSpeed = remaining <= stopDistance ? 0 : Math.sqrt(2 * deceleration * remaining);
    const desiredSpeed = Math.min(maxSpeed, stoppingSpeed);
    const maxChange = (desiredSpeed > speed ? acceleration : deceleration) * frameDelta;
    const speedDelta = Math.max(-maxChange, Math.min(maxChange, desiredSpeed - speed));
    const nextSpeed = Math.max(0, speed + speedDelta);

    if (remaining <= stopDistance && nextSpeed === 0) {
        return { position: [...target], speed: 0, arrived: true };
    }

    const travel = Math.min(remaining, nextSpeed * frameDelta);
    return {
        position: lerpPoint(position, target, remaining ? travel / remaining : 1),
        speed: nextSpeed,
        arrived: false,
    };
};
