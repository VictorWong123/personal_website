import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/', label: 'home' },
    { to: '/work', label: 'work' },
    { to: '/projects', label: 'projects' },
];

const PrimaryNav = () => (
    <nav className="primary-nav" aria-label="Primary navigation">
        {navItems.map(item => (
            <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            >
                {item.label}
            </NavLink>
        ))}
    </nav>
);

export default PrimaryNav;
