import React from 'react';

const ProjectDetail = ({ project, onClose }) => {
    if (!project) return null;

    const imageSrc = project.image || project.imageUrl;

    return (
        <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-detail-title">
            <button
                type="button"
                className="project-modal-backdrop"
                aria-label="Close project detail"
                onClick={onClose}
            />
            <section className={`project-detail ${imageSrc ? '' : 'project-detail-no-image'}`.trim()}>
                {imageSrc && (
                    <img
                        className="project-detail-image"
                        src={imageSrc}
                        alt=""
                    />
                )}
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
                    </div>
                </div>
                <button type="button" className="text-button project-detail-close" onClick={onClose}>
                    close
                </button>
            </section>
        </div>
    );
};

export default ProjectDetail;
