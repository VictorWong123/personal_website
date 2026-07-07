import React from 'react';
import { skillGroups } from '../data/siteData';

const SkillsList = ({ showHeading = true }) => (
    <section
        className="content-section"
        aria-label={showHeading ? undefined : 'skills'}
        aria-labelledby={showHeading ? 'skills-heading' : undefined}
    >
        {showHeading && <h2 id="skills-heading">skills</h2>}
        <div className="list-stack">
            {skillGroups.map(group => (
                <article className="text-item" key={group.title}>
                    <h3>{group.title.toLowerCase()}</h3>
                    <p>{group.skills.join(' / ')}</p>
                </article>
            ))}
        </div>
    </section>
);

export default SkillsList;
