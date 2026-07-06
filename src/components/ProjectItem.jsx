import React from 'react';

const ProjectItem = ({ project, variant = 'list', className = '' }) => {
    const isFeatured = variant === 'featured';
    const isGrid = variant === 'grid';
    const articleClassName = isFeatured || isGrid
        ? `${isFeatured ? '' : 'grid-project'} ${className}`.trim()
        : `text-item ${className}`.trim();

    return (
        <article className={articleClassName}>
            <h3>
                {project.url ? (
                    <a href={project.url} target="_blank" rel="noreferrer">
                        {project.title}
                    </a>
                ) : (
                    project.title
                )}
            </h3>
            {!isFeatured && <p>{project.description}</p>}
            <p className="item-tags">{project.tech.join(' / ')}</p>
        </article>
    );
};

export default ProjectItem;
