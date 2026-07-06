import React from 'react';
import { education } from '../data/siteData';

const EducationList = () => (
    <section className="content-section" aria-labelledby="education-heading">
        <h2 id="education-heading">education</h2>
        <div className="list-stack">
            {education.map(item => (
                <article className="text-item" key={item.school}>
                    <p className="item-meta">{item.date}</p>
                    <h3>{item.school} / {item.degree}</h3>
                    {item.details.map(detail => (
                        <p key={detail}>{detail}</p>
                    ))}
                </article>
            ))}
        </div>
    </section>
);

export default EducationList;
