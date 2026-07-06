import React from 'react';

const SectionHeading = ({ eyebrow, title }) => (
    <div className="section-heading">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
    </div>
);

export default SectionHeading;
