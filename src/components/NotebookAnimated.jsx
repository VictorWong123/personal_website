import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { notebookSections } from '../data/siteData';
import useNotebookAnimation from '../hooks/useNotebookAnimation';
import NotebookPage from './NotebookPage';
import NotebookPencil from './NotebookPencil';

const NotebookAnimated = () => {
    const sceneRef = useRef(null);
    const viewportRef = useRef(null);
    const viewportSizeRef = useRef('');
    const resizeFrameRef = useRef(null);
    const [layoutVersion, setLayoutVersion] = useState(0);
    const [readyPageIds, setReadyPageIds] = useState([]);

    useLayoutEffect(() => {
        const updateLayoutVersion = () => {
            const size = `${window.innerWidth}x${window.innerHeight}`;
            if (size === viewportSizeRef.current) return;
            viewportSizeRef.current = size;
            setReadyPageIds([]);
            setLayoutVersion(version => version + 1);
        };
        const scheduleLayoutUpdate = () => {
            if (resizeFrameRef.current) return;
            resizeFrameRef.current = window.requestAnimationFrame(() => {
                resizeFrameRef.current = null;
                updateLayoutVersion();
            });
        };

        updateLayoutVersion();
        window.addEventListener('resize', scheduleLayoutUpdate);
        return () => {
            window.removeEventListener('resize', scheduleLayoutUpdate);
            if (resizeFrameRef.current) window.cancelAnimationFrame(resizeFrameRef.current);
        };
    }, []);

    const handleLayoutReady = useCallback((pageId, version) => {
        if (version !== layoutVersion) return;
        setReadyPageIds(ids => ids.includes(pageId) ? ids : [...ids, pageId]);
    }, [layoutVersion]);
    const layoutReady = layoutVersion > 0 && readyPageIds.length === notebookSections.length;

    useNotebookAnimation(sceneRef, viewportRef, { layoutReady, layoutVersion });

    return (
        <main className="notebook-scroll-scene" ref={sceneRef} aria-label="Victor Wong">
            <h1 className="notebook-visually-hidden">Victor Wong</h1>
            <div className="notebook-viewport" ref={viewportRef}>
                <div className="notebook-desk-light" aria-hidden="true" />
                <div className="notebook-book" aria-hidden="true">
                    <div className="notebook-back-cover" />
                    <div className="notebook-paper-block" />
                    <div className="notebook-side-cover" />
                    <div className="notebook-spine" />
                </div>
                <div className="notebook-front-cover-position" aria-hidden="true">
                    <div className="notebook-front-cover">
                        <div className="notebook-cover-face notebook-cover-outside">
                            <div className="notebook-arcane-emblem"><img src="/circle-transparent.png" alt="" /></div>
                            <strong>Victor Wong</strong>
                        </div>
                        <div className="notebook-cover-face notebook-cover-inside" />
                    </div>
                </div>
                <div className="notebook-pages">
                    {notebookSections.map(section => (
                        <NotebookPage key={section.id} section={section} animated layoutVersion={layoutVersion} onLayoutReady={handleLayoutReady} />
                    ))}
                </div>
                <NotebookPencil className="notebook-writing-pencil" />
            </div>
        </main>
    );
};

export default NotebookAnimated;
