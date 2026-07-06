import React from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../data/siteData';
import CopyEmailButton from './CopyEmailButton';

const Footer = () => (
    <footer className="site-footer">
        <Link to="/" className="footer-link">about</Link>
        <CopyEmailButton className="footer-link footer-button" label="email" />
        <a className="footer-link" href={profile.links.linkedin} target="_blank" rel="noreferrer">linkedin</a>
        <a className="footer-link" href={profile.links.github} target="_blank" rel="noreferrer">github</a>
        <a className="footer-link" href={profile.resumeHref} download>resume</a>
    </footer>
);

export default Footer;
