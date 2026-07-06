import React from 'react';
import ProjectItem from './ProjectItem';

const fanClasses = [
    'featured-project is-left',
    'featured-project is-center',
    'featured-project is-right',
];

const FeaturedProjects = ({ projects }) => (
    <section className="content-section" aria-labelledby="featured-projects-heading">
        <h2 id="featured-projects-heading">featured</h2>
        <div className="featured-projects">
            {projects.map((project, index) => (
                <ProjectItem
                    key={project.title}
                    project={project}
                    variant="featured"
                    className={fanClasses[index]}
                />
            ))}
        </div>
    </section>
);

export default FeaturedProjects;
