import React from 'react';
import { Link } from 'react-router-dom';
import PrimaryNav from './PrimaryNav';
import { profile } from '../data/siteData';
import profileImageUrl from '../images/Golden_gate_bridge.jpeg';
import profileHoverImageUrl from '../images/hiking.jpeg';

const Header = () => (
    <header className="site-header">
        <Link className="brand-link brand-wrap" to="/" aria-label="Home">
            <span className="brand-image-stack" aria-hidden="true">
                <img className="brand-image brand-image-default" src={profileImageUrl} alt="" />
                <img className="brand-image brand-image-hover" src={profileHoverImageUrl} alt="" />
                <svg className="brand-image-ring" viewBox="0 0 44 44" focusable="false">
                    <circle cx="22" cy="22" r="21" />
                </svg>
            </span>
            <span>{profile.name}</span>
        </Link>
        <PrimaryNav />
    </header>
);

export default Header;
