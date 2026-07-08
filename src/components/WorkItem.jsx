import React from 'react';

const WorkItem = ({ job }) => (
    <article className="text-item">
        <p className="item-meta">{job.date}</p>
        <h3>{job.title} / {job.company}</h3>
        <p>{job.description}</p>
        <p className="item-tags">{job.tech.join(' / ')}</p>
    </article>
);

export default WorkItem;
