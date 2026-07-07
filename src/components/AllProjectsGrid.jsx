import React from 'react';
import ProjectItem from './ProjectItem';

const AllProjectsGrid = ({ projects, onSelect }) => (
    <section className="content-section" aria-labelledby="all-projects-heading">
        <h2 id="all-projects-heading">all projects</h2>
        <div className="project-grid">
            {projects.map(project => (
                <ProjectItem
                    key={project.title}
                    project={project}
                    variant="grid"
                    onSelect={onSelect}
                />
            ))}
        </div>
    </section>
);

export default AllProjectsGrid;
