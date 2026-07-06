import React from 'react';
import ProjectItem from './ProjectItem';

const fanClasses = [
    'featured-project is-left',
    'featured-project is-center',
    'featured-project is-right',
];

const FeaturedProjects = ({ projects, onSelect }) => (
    <section className="content-section" aria-label="Projects">
        <div className="featured-projects">
            {projects.map((project, index) => (
                <ProjectItem
                    key={project.title}
                    project={project}
                    variant="featured"
                    className={fanClasses[index]}
                    onSelect={onSelect}
                />
            ))}
        </div>
    </section>
);

export default FeaturedProjects;
