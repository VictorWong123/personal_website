import React, { useState } from 'react';
import AllProjectsGrid from './AllProjectsGrid';
import FeaturedProjects from './FeaturedProjects';
import { projects } from '../data/siteData';

const featuredProjects = projects.slice(0, 3);

const ProjectList = () => {
    const [showAll, setShowAll] = useState(false);

    return (
        <>
            <FeaturedProjects projects={featuredProjects} />
            {!showAll && projects.length > featuredProjects.length && (
                <button
                    type="button"
                    className="text-button view-all-button"
                    onClick={() => setShowAll(true)}
                >
                    view all
                </button>
            )}
            {showAll && <AllProjectsGrid projects={projects} />}
        </>
    );
};

export default ProjectList;
