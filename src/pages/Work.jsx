import React from 'react';
import SectionHeading from '../components/SectionHeading';
import WorkList from '../components/WorkList';
import EducationList from '../components/EducationList';
import SkillsList from '../components/SkillsList';

const Work = () => (
    <>
        <SectionHeading
            eyebrow="experience / education / skills"
            title="work shaped by research, data, and web systems."
        />
        <WorkList />
        <EducationList />
        <SkillsList />
    </>
);

export default Work;
