import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { education, profile, projects, skillGroups, workExperience } from '../data/siteData.js';
import SecretsCanvas from './scene/SecretsCanvas.jsx';
import useDocumentVisibility from './hooks/useDocumentVisibility.js';
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion.js';
import { projectCaptureUrls, secretsAssetManifest } from './runtime/assetManifest.js';
import { DISCOVERY_IDS, DISCOVERY_TARGETS } from './runtime/discoveryTargets.js';
import { createExperienceState, reduceExperience } from './runtime/experienceState.js';
import './secrets.css';

const links = [
    { label: 'Email', href: `mailto:${profile.email}` },
    { label: 'LinkedIn', href: profile.links.linkedin },
    { label: 'GitHub', href: profile.links.github },
    { label: 'Résumé', href: profile.resumeHref },
];

const ExperienceHeader = ({ disabled, onOverview }) => (
    <header className="secrets-header">
        <button className="secrets-wordmark" disabled={disabled} onClick={onOverview} type="button">
            Victor<br />Wong
        </button>
        <p aria-hidden="true">Field terminal / 01</p>
        <a className="secrets-exit" href="/">Exit</a>
    </header>
);

const FieldGuide = ({ disabled, onDiscover, summaryRef }) => (
    <details className="secrets-field-guide">
        <summary ref={summaryRef}>Open field guide</summary>
        <div aria-label="Discovery targets" className="secrets-field-guide__targets">
            {DISCOVERY_IDS.map((target, index) => (
                <button disabled={disabled} key={target} onClick={event => onDiscover(target, event.currentTarget)} type="button">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {DISCOVERY_TARGETS[target].label}
                </button>
            ))}
        </div>
    </details>
);

const DossierContent = () => (
    <>
        <p className="secrets-window__eyebrow">Personnel file</p>
        <h1 id="secrets-window-title" tabIndex={-1}>{profile.name}</h1>
        <p>{profile.intro}</p>
        <p>{profile.note}</p>
        <div className="secrets-window__links">
            <a href="/work">Full work history</a>
            <a href="/projects">All project details</a>
        </div>
        <details>
            <summary>Experience</summary>
            <div className="secrets-records">
                {workExperience.map(job => (
                    <article key={`${job.company}-${job.title}`}>
                        <h2>{job.title} · {job.company}</h2>
                        <small>{job.date}</small>
                        {job.description && <p>{job.description}</p>}
                    </article>
                ))}
            </div>
        </details>
        <details>
            <summary>Education</summary>
            <div className="secrets-records">
                {education.map(item => (
                    <article key={item.school}>
                        <h2>{item.degree} · {item.school}</h2>
                        <small>{item.date}</small>
                        {item.details.map(detail => <p key={detail}>{detail}</p>)}
                    </article>
                ))}
            </div>
        </details>
        <details>
            <summary>Skills</summary>
            <div className="secrets-records">
                {skillGroups.map(group => (
                    <p key={group.title}><strong>{group.title}:</strong> {group.skills.join(' · ')}</p>
                ))}
            </div>
        </details>
    </>
);

const ArchiveContent = ({ captureUrls, onSelect, selectedProject }) => (
    <>
        <p className="secrets-window__eyebrow">Recovered archive / {projects.length} files</p>
        <h1 id="secrets-window-title" tabIndex={-1}>Project archive</h1>
        <div aria-label="Choose a project" className="secrets-archive-tabs" role="list">
            {projects.map((project, index) => (
                <button
                    aria-pressed={selectedProject.title === project.title}
                    key={project.title}
                    onClick={() => onSelect(project)}
                    type="button"
                >
                    <span>{String(index + 1).padStart(2, '0')}</span>{project.title}
                </button>
            ))}
        </div>
        <article className="secrets-project-file">
            {captureUrls[selectedProject.title] && (
                <img
                    alt={`${selectedProject.title} project interface`}
                    decoding="async"
                    loading="lazy"
                    src={captureUrls[selectedProject.title]}
                />
            )}
            <p className="secrets-window__eyebrow">{selectedProject.category}</p>
            <h2>{selectedProject.title}</h2>
            <p>{selectedProject.description}</p>
            <p className="secrets-project-tech">{selectedProject.tech.join(' · ')}</p>
            {selectedProject.url && <a href={selectedProject.url} rel="noreferrer" target="_blank">View project</a>}
        </article>
    </>
);

const FieldNoteContent = () => (
    <>
        <p className="secrets-window__eyebrow">Companion observation</p>
        <h1 id="secrets-window-title" tabIndex={-1}>Field note</h1>
        <blockquote>{profile.note}</blockquote>
        <p>{profile.headline}</p>
    </>
);

const ContactContent = () => (
    <>
        <p className="secrets-window__eyebrow">Open channel</p>
        <h1 id="secrets-window-title" tabIndex={-1}>Contact beacon</h1>
        <p>Connect with {profile.name} or continue through the main portfolio.</p>
        <div className="secrets-contact-links">
            {links.map(link => (
                <a
                    href={link.href}
                    key={link.label}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                >
                    {link.label}<span aria-hidden="true">↗</span>
                </a>
            ))}
        </div>
    </>
);

const DiscoveryWindow = ({ captureUrls, onClose, onSelect, selectedProject, target }) => {
    const dialogRef = useRef(/** @type {HTMLDialogElement | null} */ (null));
    const titleRef = useRef(/** @type {HTMLHeadingElement | null} */ (null));

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return undefined;
        if (!dialog.open) dialog.showModal();
        titleRef.current = dialog.querySelector('#secrets-window-title');
        titleRef.current?.focus({ preventScroll: true });
        return undefined;
    }, [target]);

    return (
        <dialog
            aria-labelledby="secrets-window-title"
            className={`secrets-window secrets-window--${target}`}
            onCancel={event => {
                event.preventDefault();
                onClose();
            }}
            ref={dialogRef}
        >
            <button aria-label="Close discovery" className="secrets-window__close" onClick={onClose} type="button">Close <span aria-hidden="true">×</span></button>
            <div className="secrets-window__body">
                {target === 'dossier' && <DossierContent />}
                {target === 'archive' && <ArchiveContent captureUrls={captureUrls} onSelect={onSelect} selectedProject={selectedProject} />}
                {target === 'fieldNote' && <FieldNoteContent />}
                {target === 'contact' && <ContactContent />}
            </div>
        </dialog>
    );
};

const Intro = ({ onSkip }) => {
    const dialogRef = useRef(/** @type {HTMLDialogElement | null} */ (null));
    useEffect(() => {
        if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
    }, []);
    return (
        <dialog
            aria-labelledby="secrets-intro-title"
            className="secrets-intro"
            onCancel={event => {
                event.preventDefault();
                onSkip();
            }}
            ref={dialogRef}
        >
            <div className="secrets-intro-message"><p>Unit 01</p><h1 id="secrets-intro-title">Welcome, traveler.</h1></div>
            <button autoFocus onClick={onSkip} type="button">Skip intro <span aria-hidden="true">Esc</span></button>
        </dialog>
    );
};

const useSecretsMetadata = () => {
    useEffect(() => {
        const previousTitle = document.title;
        const existing = /** @type {HTMLMetaElement | null} */ (document.querySelector('meta[name="theme-color"]'));
        const previousColor = existing?.content;
        const meta = existing || document.createElement('meta');
        if (!existing) {
            meta.name = 'theme-color';
            document.head.append(meta);
        }
        document.title = `${profile.name} — Secrets`;
        meta.content = '#030608';
        return () => {
            document.title = previousTitle;
            if (previousColor) meta.content = previousColor;
            else meta.remove();
        };
    }, []);
};

const SecretsExperience = ({ assetManifest = secretsAssetManifest, captureUrls = projectCaptureUrls }) => {
    const reducedMotion = usePrefersReducedMotion();
    const visible = useDocumentVisibility();
    const [state, dispatch] = useReducer(reduceExperience, {
        awaitAssets: Boolean(assetManifest), reducedMotion, visible,
    }, createExperienceState);
    const [sceneFailed, setSceneFailed] = useState(false);
    const [selectedProject, setSelectedProject] = useState(() => projects.find(project => project.title === 'FlexFlow') || projects[0]);
    const [discovered, setDiscovered] = useState(() => new Set());
    const fieldGuideSummaryRef = useRef(/** @type {HTMLElement | null} */ (null));
    const previousPhaseRef = useRef(state.phase);
    const restoreFocusRef = useRef(/** @type {HTMLElement | null} */ (null));

    useSecretsMetadata();
    useEffect(() => dispatch({ type: 'VISIBILITY_CHANGE', visible }), [visible]);
    useEffect(() => dispatch({ type: 'MOTION_CHANGE', reducedMotion }), [reducedMotion]);
    useEffect(() => {
        if (previousPhaseRef.current === 'intro' && state.phase === 'ready') {
            requestAnimationFrame(() => fieldGuideSummaryRef.current?.focus({ preventScroll: true }));
        }
        previousPhaseRef.current = state.phase;
    }, [state.phase]);

    const dialogTarget = state.phase === 'ready' ? state.activeTarget : null;
    useEffect(() => {
        if (!dialogTarget) return;
        setDiscovered(previous => {
            if (previous.has(dialogTarget)) return previous;
            const next = new Set(previous);
            next.add(dialogTarget);
            return next;
        });
    }, [dialogTarget]);

    const discover = useCallback((target, trigger) => {
        if (trigger) restoreFocusRef.current = trigger;
        else if (document.activeElement instanceof HTMLElement) restoreFocusRef.current = document.activeElement;
        dispatch({ type: 'DISCOVER', target });
    }, []);
    const closeDiscovery = useCallback(() => {
        dispatch({ type: 'CLOSE_DISCOVERY' });
        requestAnimationFrame(() => {
            const focusTarget = restoreFocusRef.current?.isConnected
                ? restoreFocusRef.current
                : fieldGuideSummaryRef.current;
            focusTarget?.focus({ preventScroll: true });
        });
    }, []);
    const handleSceneError = useCallback(() => {
        setSceneFailed(true);
        dispatch({ type: 'SCENE_FAILURE' });
    }, []);
    const handleArrivalComplete = useCallback(journeyId => dispatch({ type: 'ARRIVAL_COMPLETE', journeyId }), []);
    const handleIntroComplete = useCallback(() => dispatch({ type: 'INTRO_COMPLETE' }), []);
    const handleJourneyComplete = useCallback(journeyId => dispatch({ type: 'ARRIVE', journeyId }), []);
    const handleSceneReady = useCallback(() => dispatch({ type: 'SCENE_READY' }), []);
    const skipIntro = useCallback(() => dispatch({ type: 'INTRO_SKIP' }), []);

    const interactionDisabled = state.phase === 'intro' || state.phase === 'loading';
    const selectedProjectImage = captureUrls[selectedProject.title];
    const status = state.phase === 'traveling'
        ? `Traveling to ${state.destinationTarget ? DISCOVERY_TARGETS[state.destinationTarget].label : 'overview'}`
        : dialogTarget ? `${DISCOVERY_TARGETS[dialogTarget].label} opened` : 'Explore the signals in the scene';

    return (
        <div className={`secrets-experience${sceneFailed || !assetManifest ? ' secrets-experience--fallback' : ''}`} data-location={state.activeLocation}>
            <a className="secrets-skip-link" href="#secrets-content">Skip to field guide</a>
            <ExperienceHeader disabled={interactionDisabled} onOverview={() => dispatch({ type: 'RETURN_OVERVIEW' })} />
            <div className="secrets-canvas-layer">
                {assetManifest && !sceneFailed && (
                    <SecretsCanvas
                        {...state}
                        assetManifest={assetManifest}
                        interactionDisabled={interactionDisabled}
                        onArrivalAnimationComplete={handleArrivalComplete}
                        onDiscover={discover}
                        onError={handleSceneError}
                        onIntroComplete={handleIntroComplete}
                        onJourneyComplete={handleJourneyComplete}
                        onReady={handleSceneReady}
                        selectedProject={selectedProject}
                        selectedProjectImage={selectedProjectImage}
                    />
                )}
            </div>
            <main className="secrets-content" id="secrets-content" inert={state.phase === 'intro' ? true : undefined}>
                <div className="secrets-orientation">
                    <p>Click a signal to investigate</p>
                    <span>{discovered.size} / {DISCOVERY_IDS.length} discovered</span>
                </div>
                <FieldGuide disabled={interactionDisabled} onDiscover={discover} summaryRef={fieldGuideSummaryRef} />
            </main>
            <p aria-live="polite" className={state.phase === 'traveling' ? 'secrets-travel-status' : 'secrets-visually-hidden'}>{status}</p>
            {(sceneFailed || !assetManifest) && <p className="secrets-scene-fallback" role="status">3D scene unavailable. Use the field guide to investigate every signal.</p>}
            {dialogTarget && (
                <DiscoveryWindow
                    captureUrls={captureUrls}
                    key={dialogTarget}
                    onClose={closeDiscovery}
                    onSelect={setSelectedProject}
                    selectedProject={selectedProject}
                    target={dialogTarget}
                />
            )}
            {state.phase === 'intro' && <Intro onSkip={skipIntro} />}
        </div>
    );
};

export default SecretsExperience;
