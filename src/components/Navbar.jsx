import React, { useState, useEffect } from 'react';

const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
];

const socials = [
    { href: 'https://github.com/VictorWong123', label: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { href: 'https://www.linkedin.com/in/victor-wong-58029a238/', label: 'LinkedIn', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg' },
];

const email = 'victorwong315@gmail.com';

const Navbar = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [activeSection, setActiveSection] = useState('about');

    useEffect(() => {
        const handleScroll = () => {
            const offsets = navLinks.map(link => {
                const el = document.getElementById(link.id);
                if (!el) return Infinity;
                const rect = el.getBoundingClientRect();
                return Math.abs(rect.top - 80); // 80px offset for fixed nav
            });
            const minOffset = Math.min(...offsets);
            const idx = offsets.indexOf(minOffset);
            setActiveSection(navLinks[idx].id);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleEmailClick = async (e) => {
        e.preventDefault();
        try {
            await navigator.clipboard.writeText(email);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 1200);
        } catch (err) { }
    };

    const handleNameClick = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <aside className="sidebar">
            <div className="sidebar__top">
                <button
                    className="sidebar__name"
                    aria-label="Scroll to top"
                    onClick={handleNameClick}
                >
                    Victor Wong
                </button>
                <div className="sidebar__title">Software Engineer</div>
                <nav className="sidebar__nav">
                    <ul>
                        {navLinks.map(link => (
                            <li key={link.id}>
                                <a
                                    href={`#${link.id}`}
                                    className={activeSection === link.id ? 'active' : ''}
                                    onClick={e => {
                                        e.preventDefault();
                                        const el = document.getElementById(link.id);
                                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="sidebar__socials">
                        {socials.map(s => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                                <img src={s.icon} alt={s.label} />
                            </a>
                        ))}
                        <button
                            className="sidebar__email-btn"
                            aria-label="Copy email"
                            onClick={handleEmailClick}
                            style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
                        >
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="M22 6 12 13 2 6" />
                            </svg>
                        </button>
                        {showTooltip && <span className="sidebar__tooltip">Email copied!</span>}
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default Navbar; 