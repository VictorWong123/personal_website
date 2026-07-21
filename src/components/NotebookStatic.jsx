import React from 'react';
import { notebookSections } from '../data/siteData';
import NotebookPage from './NotebookPage';

const NotebookStatic = () => (
    <main className="notebook-static-notebook" aria-label="Victor Wong">
        <h1 className="notebook-visually-hidden">Victor Wong</h1>
        <div className="notebook-static-grid">
            {notebookSections.map(section => <NotebookPage key={section.id} section={section} />)}
        </div>
    </main>
);

export default NotebookStatic;
