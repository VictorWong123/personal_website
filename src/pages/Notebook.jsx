import React, { useEffect } from 'react';
import NotebookAnimated from '../components/NotebookAnimated';
import NotebookStatic from '../components/NotebookStatic';
import useNotebookPrefersReducedMotion from '../hooks/useNotebookPrefersReducedMotion';
import '../styles/Notebook.css';

const metadata = {
    robots: 'noindex, nofollow, noarchive',
    themeColor: '#241a13',
};

const useNotebookMetadata = () => {
    useEffect(() => {
        const restoreMeta = (name, value) => {
            const existing = document.head.querySelector(`meta[name="${name}"]`);
            const created = !existing;
            const element = existing || document.createElement('meta');
            const previousContent = element.getAttribute('content');

            if (created) {
                element.name = name;
                document.head.append(element);
            }
            element.content = value;

            return () => {
                if (created) {
                    element.remove();
                } else if (previousContent === null) {
                    element.removeAttribute('content');
                } else {
                    element.content = previousContent;
                }
            };
        };

        const restoreThemeColor = restoreMeta('theme-color', metadata.themeColor);
        const restoreRobots = restoreMeta('robots', metadata.robots);

        return () => {
            restoreThemeColor();
            restoreRobots();
        };
    }, []);
};

const Notebook = () => {
    const prefersReducedMotion = useNotebookPrefersReducedMotion();

    useNotebookMetadata();
    return (
        <div className="notebook-experience">
            {prefersReducedMotion ? <NotebookStatic /> : <NotebookAnimated />}
        </div>
    );
};

export default Notebook;
