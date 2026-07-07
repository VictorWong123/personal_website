import React from 'react';

const ProjectDetail = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-detail-title">
            <button
                type="button"
                className="project-modal-backdrop"
                aria-label="Close project detail"
                onClick={onClose}
            />
            <section className="project-detail">
                <div className="project-image-placeholder" aria-hidden="true">
                    image placeholder
                </div>
                <div className="project-detail-copy">
                    <h2 id="project-detail-title">{project.title}</h2>
                    <p>{project.description}</p>
                    <p className="item-tags">{project.tech.join(' / ')}</p>
                    <div className="project-detail-actions">
                        {project.url && (
                            <a href={project.url} target="_blank" rel="noreferrer">
                                github
                            </a>
                        )}
                        <button type="button" className="text-button" onClick={onClose}>
                            close
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProjectDetail;
