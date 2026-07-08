import React, { useState } from 'react';
import AllProjectsGrid from './AllProjectsGrid';
import FeaturedProjects from './FeaturedProjects';
import ProjectDetail from './ProjectDetail';
import { projects } from '../data/siteData';

const featuredProjects = projects.slice(0, 3);
const allProjects = projects.slice(3);

const ProjectList = () => {
    const [showAll, setShowAll] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <>
            <FeaturedProjects projects={featuredProjects} onSelect={setSelectedProject} />
            {!showAll && allProjects.length > 0 && (
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
                <>
                    <AllProjectsGrid
                        projects={allProjects}
                        onSelect={setSelectedProject}
                    />
                    <div className="view-all-row">
                        <button
                            type="button"
                            className="text-button view-all-button"
                            onClick={() => setShowAll(false)}
                        >
                            collapse
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default ProjectList;
