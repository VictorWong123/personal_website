import React, { useState } from 'react';
import AllProjectsGrid from './AllProjectsGrid';
import FeaturedProjects from './FeaturedProjects';
import ProjectDetail from './ProjectDetail';
import { projects } from '../data/siteData';

const featuredProjects = projects.slice(0, 3);

const ProjectList = () => {
    const [showAll, setShowAll] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <>
            <FeaturedProjects projects={featuredProjects} onSelect={setSelectedProject} />
            {!showAll && projects.length > featuredProjects.length && (
                <div className="view-all-row">
                    <button
                        type="button"
                        className="text-button view-all-button"
                        onClick={() => setShowAll(true)}
                    >
                        view all
                    </button>
                </div>
            )}
            <ProjectDetail
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
            {showAll && (
                <AllProjectsGrid
                    projects={projects}
                    onSelect={setSelectedProject}
                />
            )}
        </>
    );
};

export default ProjectList;
