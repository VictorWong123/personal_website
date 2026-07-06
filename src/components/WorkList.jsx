import React from 'react';
import WorkItem from './WorkItem';
import { workExperience } from '../data/siteData';

const WorkList = () => (
    <section className="content-section" aria-labelledby="work-heading">
        <h2 id="work-heading">work</h2>
        <div className="list-stack">
            {workExperience.map(job => (
                <WorkItem key={`${job.company}-${job.title}`} job={job} />
            ))}
        </div>
    </section>
);

export default WorkList;
