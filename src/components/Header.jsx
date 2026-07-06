import React from 'react';
import { Link } from 'react-router-dom';
import PrimaryNav from './PrimaryNav';
import { profile } from '../data/siteData';

const Header = () => (
    <header className="site-header">
        <Link className="brand-link" to="/" aria-label="Home">
            {profile.name}
        </Link>
        <PrimaryNav />
    </header>
);

export default Header;
