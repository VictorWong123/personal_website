import React from 'react';

const SectionHeading = ({ eyebrow, title, id }) => (
    <div className="section-heading">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h1 id={id}>{title}</h1>}
    </div>
);

export default SectionHeading;
