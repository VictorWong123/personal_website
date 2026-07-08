import React from 'react';

const ProjectItem = ({ project, variant = 'list', className = '', onSelect }) => {
    const isFeatured = variant === 'featured';
    const isGrid = variant === 'grid';
    const articleClassName = isFeatured || isGrid
        ? `${isFeatured ? '' : 'grid-project'} ${className}`.trim()
        : `text-item ${className}`.trim();

    const openProject = () => onSelect?.(project);
    const handleKeyDown = event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openProject();
        }
    };

    return (
        <article
            className={articleClassName}
            onClick={openProject}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Read more about ${project.title}`}
        >
            <div className="project-card-main">
                <div className="project-card-header">
                    <h3>
                        {project.url ? (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={event => event.stopPropagation()}
                            >
                                {project.title}
                            </a>
                        ) : (
                            project.title
                        )}
                    </h3>
                    {project.category && <p className="project-label">{project.category}</p>}
                </div>
                <p>{project.summary}</p>
            </div>
        </article>
    );
};

export default ProjectItem;
