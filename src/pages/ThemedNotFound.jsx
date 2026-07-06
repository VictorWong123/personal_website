import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';

const ThemedNotFound = () => (
    <section className="content-section" aria-labelledby="not-found-heading">
        <SectionHeading
            eyebrow="404"
            title="this page does not exist."
        />
        <p className="intro-copy">
            Head back <Link to="/">home</Link> or browse <Link to="/projects">projects</Link>.
        </p>
    </section>
);

export default ThemedNotFound;
