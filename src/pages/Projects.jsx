import React from 'react';
import SectionHeading from '../components/SectionHeading';
import ProjectList from '../components/ProjectList';

const Projects = () => (
    <>
        <SectionHeading
            eyebrow="selected work"
            title="projects."
        />
        <ProjectList />
    </>
);

export default Projects;
