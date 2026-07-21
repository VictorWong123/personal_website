import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MIN_PENCIL_LEAD = 8;
const MAX_PENCIL_LEAD = 18;
const PENCIL_LEAD_CHARACTER_RATIO = 0.65;
const PENCIL_PRESS_DISTANCE = 1.6;
const PENCIL_SIDE_TO_SIDE_DISTANCE = 0.75;
const PENCIL_ROTATION_SWING = 5;
const MOBILE_PENCIL_BASELINE_OFFSET = 14;
const INITIAL_BOOK_ROTATION_X = 28;
const INITIAL_BOOK_ROTATION_Z = -7;
const INITIAL_BOOK_SCALE = 0.9;
const INITIAL_BOOK_OFFSET_Y = 12;
const TABLET_WIDTH = 1024;
const STACK_EDGE_GAP = 18;
const STACK_UNDERLAY_OFFSET = 0.05;
const STACK_LAYERS = [40, 39, 38];
const WRITING_DURATIONS = [1.32, 2.4, 2.2];
const STAGING_GAPS = [0.92, 0.84, 0.82];

const getStackTransform = (page, index) => {
    const pageWidth = page.offsetWidth;
    const pageHeight = page.offsetHeight;
    const preferredScale = window.innerWidth < 640 ? 0.47 : window.innerWidth < TABLET_WIDTH ? 0.52 : 0.55;
    const availableWidth = window.innerWidth - (window.innerWidth * 0.5 + pageWidth * 0.5) - STACK_EDGE_GAP * 2;
    const scale = Math.min(preferredScale, Math.max(0.3, availableWidth / (pageWidth * (1 + STACK_UNDERLAY_OFFSET))));
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < TABLET_WIDTH;
    const startCenterY = window.innerHeight * (isMobile ? 0.57 : isTablet ? 0.52 : 0.55);
    const targetCenterX = window.innerWidth - 20 - (pageWidth * scale) / 2 - index * 8;
    const targetCenterY = (isMobile ? 72 : 104) + (pageHeight * scale) / 2 + index * 12;
    const rotations = [-2.5, 1.5, 4];

    return {
        x: targetCenterX - window.innerWidth * 0.5,
        y: targetCenterY - startCenterY,
        scale,
        rotation: rotations[index] ?? (index % 2 ? 1.5 : -2.5),
    };
};

const getStackTween = (page, index) => ({
    x: () => getStackTransform(page, index).x,
    y: () => getStackTransform(page, index).y,
    scale: () => getStackTransform(page, index).scale,
    rotation: () => getStackTransform(page, index).rotation,
});

const getUnderStackTween = (page, index) => ({
    x: () => {
        const target = getStackTransform(page, index);
        return target.x - page.offsetWidth * target.scale * STACK_UNDERLAY_OFFSET;
    },
    y: () => {
        const target = getStackTransform(page, index);
        return target.y + page.offsetHeight * target.scale * 0.18;
    },
    scale: () => getStackTransform(page, index).scale * 0.96,
    rotation: () => getStackTransform(page, index).rotation - 2,
});

const getPencilGeometry = (line, pencil, viewport) => {
    const content = line.querySelector('.notebook-ink-content');
    const lineRect = (content || line).getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const pencilWidth = pencil.offsetWidth || 42;
    const pencilHeight = pencil.offsetHeight || pencilWidth * (198 / 60);
    const characterCount = Math.max(content?.textContent.trim().length || 0, 1);
    const desiredLead = Math.min(MAX_PENCIL_LEAD, Math.max(MIN_PENCIL_LEAD, (lineRect.width / characterCount) * PENCIL_LEAD_CHARACTER_RATIO));

    return {
        content,
        characterCount,
        pencilWidth,
        pencilHeight,
        desiredLead,
        x: lineRect.left - viewportRect.left,
        width: lineRect.width,
        baseline: lineRect.top - viewportRect.top + Math.min(lineRect.height, 30) * 0.8 + (window.innerWidth < 640 ? MOBILE_PENCIL_BASELINE_OFFSET : 0),
    };
};

const getPencilPlacement = (geometry, progress) => {
    const pencilLead = Math.min(geometry.desiredLead, geometry.width * (1 - progress));

    return {
        x: geometry.x + geometry.width * progress + pencilLead - geometry.pencilWidth * 0.25,
        y: geometry.baseline - geometry.pencilHeight * 0.5,
    };
};

const addWritingSequence = (timeline, page, pencil, viewport, startAt, duration) => {
    const lines = [...page.querySelectorAll('.notebook-ink-line')];
    const lineDuration = duration / Math.max(lines.length, 1);
    timeline.set(pencil, { autoAlpha: 1 }, startAt);

    lines.forEach((line, index) => {
        const lineStart = startAt + index * lineDuration;
        const writingState = { progress: 0 };
        let geometry;

        timeline.call(() => {
            geometry = getPencilGeometry(line, pencil, viewport);
            gsap.set(pencil, { ...getPencilPlacement(geometry, 0), rotation: 17 });
        }, [], lineStart);
        timeline.to(writingState, {
            progress: 1,
            duration: lineDuration * 0.9,
            ease: 'none',
            onUpdate: () => {
                if (!geometry) return;
                const placement = getPencilPlacement(geometry, writingState.progress);
                const phase = writingState.progress * geometry.characterCount * Math.PI * 1.6;
                gsap.set(pencil, {
                    x: placement.x + Math.cos(phase) * PENCIL_SIDE_TO_SIDE_DISTANCE,
                    y: placement.y + Math.max(0, Math.sin(phase)) * PENCIL_PRESS_DISTANCE,
                    rotation: 17 + Math.sin(phase) * PENCIL_ROTATION_SWING,
                });
                gsap.set(geometry.content, { clipPath: `inset(0 ${100 - writingState.progress * 100}% 0 0)` });
            },
        }, lineStart);
    });
    timeline.to(pencil, { autoAlpha: 0, duration: lineDuration * 0.12 }, startAt + duration - lineDuration * 0.12);
};

const addTearOutSequence = (timeline, page, index, startAt, duration) => {
    const tearEdge = page.querySelector('.notebook-tear-edge');
    const tearDuration = duration * 0.42;
    const underlayDuration = duration * 0.26;
    if (!tearEdge) return;

    timeline.set(page, { transformOrigin: 'left bottom', zIndex: STACK_LAYERS[index] }, startAt);
    timeline.set(tearEdge, { autoAlpha: 1, clipPath: 'inset(0 0 100% 0)' }, startAt);
    timeline.to(tearEdge, { clipPath: 'inset(0 0 0% 0)', duration: tearDuration, ease: 'power1.inOut' }, startAt);
    timeline.to(page, { x: '+=18', y: '-=4', rotateY: -12, rotation: `+=${index % 2 ? 1.8 : -1.8}`, duration: tearDuration, ease: 'power2.inOut' }, startAt);
    timeline.to(page, { ...getUnderStackTween(page, index), rotateY: -7, duration: underlayDuration, ease: 'power2.inOut' }, startAt + tearDuration);
    timeline.to(page, { ...getStackTween(page, index), zIndex: STACK_LAYERS[index], rotateY: 0, duration: duration - tearDuration - underlayDuration, ease: 'power3.out' }, startAt + tearDuration + underlayDuration);
};

const useNotebookAnimation = (sceneRef, viewportRef, { layoutReady, layoutVersion }) => {
    useLayoutEffect(() => {
        const scene = sceneRef.current;
        const viewport = viewportRef.current;
        if (!scene || !viewport || !layoutReady) return undefined;

        let refreshFrame;
        const context = gsap.context(() => {
            const book = scene.querySelector('.notebook-book');
            const frontCoverPosition = scene.querySelector('.notebook-front-cover-position');
            const frontCover = scene.querySelector('.notebook-front-cover');
            const deskLight = scene.querySelector('.notebook-desk-light');
            const pencil = scene.querySelector('.notebook-writing-pencil');
            const pages = [...scene.querySelectorAll('[data-notebook-page]')];
            const inkContents = scene.querySelectorAll('.notebook-ink-content');
            const coverEmblem = scene.querySelector('.notebook-arcane-emblem');
            const pins = scene.querySelectorAll('[data-notebook-pin]');
            if (!book || !frontCoverPosition || !frontCover || !pencil || !pages.length) return;

            const setPageAccessible = (page, isAccessible) => {
                page.toggleAttribute('aria-hidden', !isAccessible);
                page.inert = !isAccessible;
            };
            const pageStarts = [];
            let nextStart = 1.12;
            pages.forEach((page, index) => {
                pageStarts.push(nextStart);
                nextStart += (WRITING_DURATIONS[index] ?? WRITING_DURATIONS.at(-1)) + (STAGING_GAPS[index] ?? STAGING_GAPS.at(-1));
            });

            gsap.set(inkContents, { clipPath: 'inset(0 100% 0 0)' });
            gsap.set(pencil, { autoAlpha: 0, transformOrigin: '50% 100%' });
            gsap.set(pins, { autoAlpha: 0, scale: 0.82 });
            gsap.set(book, { xPercent: -50, yPercent: -50, rotateX: INITIAL_BOOK_ROTATION_X, rotateZ: INITIAL_BOOK_ROTATION_Z, scale: INITIAL_BOOK_SCALE, y: INITIAL_BOOK_OFFSET_Y });
            gsap.set(frontCoverPosition, { xPercent: -50, yPercent: -50, rotateX: INITIAL_BOOK_ROTATION_X, rotateZ: INITIAL_BOOK_ROTATION_Z, scale: INITIAL_BOOK_SCALE, y: INITIAL_BOOK_OFFSET_Y });
            gsap.set(pages, { xPercent: -50, yPercent: -50, rotateX: INITIAL_BOOK_ROTATION_X, rotateZ: INITIAL_BOOK_ROTATION_Z, scale: INITIAL_BOOK_SCALE, y: INITIAL_BOOK_OFFSET_Y, transformOrigin: '50% 50%', autoAlpha: 0 });
            pages.forEach(page => setPageAccessible(page, false));
            gsap.set(frontCover, { rotateY: 0 });

            const timeline = gsap.timeline({
                defaults: { ease: 'power2.inOut' },
                scrollTrigger: {
                    trigger: scene,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * (window.innerWidth < 640 ? 4.2 : 5.5)}`,
                    pin: viewport,
                    pinSpacing: true,
                    scrub: 0.65,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: self => {
                        const currentTime = self.progress * self.animation.duration();
                        pages.forEach((page, index) => setPageAccessible(page, currentTime >= pageStarts[index]));
                    },
                },
            });

            timeline.to(deskLight, { opacity: 0.9, scale: 1.08, duration: 0.58 }, 0.08);
            timeline.to(book, { rotateX: 4, rotateZ: 0, scale: 1, y: 0, duration: 0.58 }, 0.08);
            timeline.to(frontCoverPosition, { rotateX: 4, rotateZ: 0, scale: 1, y: 0, duration: 0.58 }, 0.08);
            timeline.to(pages, { rotateX: 0, rotateZ: 0, scale: 1, y: 0, duration: 0.58 }, 0.08);
            timeline.to(frontCover, { rotateY: () => window.innerWidth < 640 ? -106 : -168, duration: 0.64, ease: 'power3.inOut' }, 0.42);
            if (coverEmblem) timeline.to(coverEmblem, { autoAlpha: 0, duration: 0.64, ease: 'none' }, 0.42);

            pages.forEach((page, index) => {
                const start = pageStarts[index];
                const writingDuration = WRITING_DURATIONS[index] ?? WRITING_DURATIONS.at(-1);
                const tearStart = start + writingDuration + (index === 1 ? 0.22 : 0.28);
                const tearDuration = index === 1 ? 0.64 : 0.72;
                const pin = page.querySelector('[data-notebook-pin]');
                timeline.to(page, { autoAlpha: 1, duration: 0.15 }, start);
                addWritingSequence(timeline, page, pencil, viewport, start, writingDuration);
                addTearOutSequence(timeline, page, index, tearStart, tearDuration);
                if (index === 0) timeline.set(frontCoverPosition, { zIndex: 15 }, start);
                if (pin) timeline.to(pin, { autoAlpha: 1, scale: 1, duration: 0.18, ease: 'power2.out' }, tearStart + tearDuration);
            });
            timeline.to(book, { y: 8, rotateX: 1, duration: 0.3, ease: 'power1.out' }, nextStart - 0.16);
            refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
        }, scene);

        return () => {
            if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
            context.revert();
        };
    }, [layoutReady, layoutVersion, sceneRef, viewportRef]);
};

export default useNotebookAnimation;
