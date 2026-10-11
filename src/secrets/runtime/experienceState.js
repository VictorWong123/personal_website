import { assertDiscoveryTarget, assertLocation, DISCOVERY_TARGETS } from './discoveryTargets.js';

export const createExperienceState = ({
    initialLocation = 'overview',
    awaitAssets = false,
    reducedMotion = false,
    visible = true,
} = {}) => {
    assertLocation(initialLocation);
    return {
        activeLocation: initialLocation,
        activeTarget: null,
        destination: initialLocation,
        destinationTarget: null,
        journeyId: 0,
        phase: reducedMotion || !awaitAssets ? 'ready' : 'loading',
        reducedMotion,
        sceneAvailable: false,
        visible,
    };
};

const discover = (state, targetId) => {
    assertDiscoveryTarget(targetId);
    const target = DISCOVERY_TARGETS[targetId];
    const journeyId = state.journeyId + 1;
    const isAtTargetLocation = target.location === state.activeLocation && state.phase !== 'traveling';
    if (state.reducedMotion || !state.sceneAvailable || isAtTargetLocation) {
        return {
            ...state,
            activeLocation: target.location,
            activeTarget: targetId,
            destination: target.location,
            destinationTarget: targetId,
            journeyId,
            phase: state.phase === 'loading' ? 'loading' : 'ready',
        };
    }
    return {
        ...state,
        activeTarget: null,
        destination: target.location,
        destinationTarget: targetId,
        journeyId,
        phase: 'traveling',
    };
};

export const reduceExperience = (state, event) => {
    switch (event.type) {
        case 'INTRO_COMPLETE':
        case 'INTRO_SKIP':
            return state.phase === 'intro' ? { ...state, phase: 'ready' } : state;
        case 'SCENE_READY':
            return {
                ...state,
                phase: !state.reducedMotion && !state.destinationTarget ? 'intro' : 'ready',
                sceneAvailable: true,
            };
        case 'SCENE_FAILURE':
            return {
                ...state,
                activeLocation: state.destination,
                activeTarget: state.destinationTarget,
                phase: 'ready',
                sceneAvailable: false,
            };
        case 'DISCOVER':
            return discover(state, event.target);
        case 'CLOSE_DISCOVERY': {
            const journeyId = state.journeyId + 1;
            if (state.phase === 'traveling' && !state.reducedMotion && state.sceneAvailable) {
                return {
                    ...state,
                    activeTarget: null,
                    destination: state.activeLocation,
                    destinationTarget: null,
                    journeyId,
                    phase: 'traveling',
                };
            }
            return {
                ...state,
                activeTarget: null,
                destinationTarget: null,
                journeyId,
                phase: state.phase === 'loading' ? 'loading' : 'ready',
            };
        }
        case 'RETURN_OVERVIEW': {
            const journeyId = state.journeyId + 1;
            if (state.reducedMotion || !state.sceneAvailable || state.activeLocation === 'overview') {
                return {
                    ...state,
                    activeLocation: 'overview',
                    activeTarget: null,
                    destination: 'overview',
                    destinationTarget: null,
                    journeyId,
                    phase: state.phase === 'loading' ? 'loading' : 'ready',
                };
            }
            return {
                ...state,
                activeTarget: null,
                destination: 'overview',
                destinationTarget: null,
                journeyId,
                phase: 'traveling',
            };
        }
        case 'ARRIVE':
            if (event.journeyId !== state.journeyId || state.phase !== 'traveling') {
                return state;
            }
            return {
                ...state,
                activeLocation: state.destination,
                activeTarget: state.destinationTarget,
                phase: state.destinationTarget ? 'arriving' : 'ready',
            };
        case 'ARRIVAL_COMPLETE':
            if (event.journeyId !== state.journeyId || state.phase !== 'arriving') {
                return state;
            }
            return { ...state, phase: 'ready' };
        case 'VISIBILITY_CHANGE':
            return { ...state, visible: event.visible };
        case 'MOTION_CHANGE':
            if (!event.reducedMotion) {
                return { ...state, reducedMotion: false };
            }
            return {
                ...state,
                activeLocation: state.destination,
                activeTarget: state.destinationTarget,
                phase: 'ready',
                reducedMotion: true,
            };
        default:
            return state;
    }
};

export const getFrameLoop = ({ reducedMotion, visible }, motionActive = false) => {
    if (!visible) return 'never';
    return reducedMotion || !motionActive ? 'demand' : 'always';
};
