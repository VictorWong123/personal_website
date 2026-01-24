import React, { useState, useEffect } from 'react';

const resumePDF = '/personal_website/Victor_wong_resume (7).pdf';

const titles = ['Software Engineer', 'Student', 'Data Scientist'];

const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
];

const socials = [
    { href: 'https://github.com/VictorWong123', label: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { href: 'https://www.linkedin.com/in/victor-wong-58029a238/', label: 'LinkedIn', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg' },
];

const email = 'victorwong315@gmail.com';

const Navbar = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [activeSection, setActiveSection] = useState('about');
    const [typingText, setTypingText] = useState('');
    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offsets = navLinks.map(link => {
                const el = document.getElementById(link.id);
                if (!el) return Infinity;
                const rect = el.getBoundingClientRect();
                return Math.abs(rect.top - 80);
            });
            const minOffset = Math.min(...offsets);
            const idx = offsets.indexOf(minOffset);
            setActiveSection(navLinks[idx].id);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        let timeout;
        const typeTitle = () => {
            const currentTitle = titles[currentTitleIndex];
            if (!isDeleting && charIndex < currentTitle.length) {
                setTypingText(currentTitle.substring(0, charIndex + 1));
                setCharIndex(charIndex + 1);
                timeout = setTimeout(typeTitle, 100);
            } else if (!isDeleting && charIndex === currentTitle.length) {
                timeout = setTimeout(() => setIsDeleting(true), 1200);
            } else if (isDeleting && charIndex > 0) {
                setTypingText(currentTitle.substring(0, charIndex - 1));
                setCharIndex(charIndex - 1);
                timeout = setTimeout(typeTitle, 50);
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setCurrentTitleIndex((currentTitleIndex + 1) % titles.length);
                timeout = setTimeout(typeTitle, 500);
            }
        };
        timeout = setTimeout(typeTitle, 200);
        return () => clearTimeout(timeout);
    }, [currentTitleIndex, charIndex, isDeleting]);

    const handleEmailClick = async (e) => {
        e.preventDefault();
        try {
            await navigator.clipboard.writeText(email);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 1200);
        } catch (err) { }
    };

    const handleResumeDownload = async (e) => {
        e.preventDefault();
        try {
            const link = document.createElement('a');
            link.href = resumePDF;
            link.download = 'Victor_Wong_Resume.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading resume:', error);
        }
    };

    const handleNameClick = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <aside className="w-[340px] min-w-[340px] max-w-[340px] h-screen fixed top-0 left-0 bg-[#0a192f] text-[#ccd6f6] flex flex-col items-start justify-center z-50 border-r border-[#233554] px-10">
            <div className="w-full flex flex-col items-start justify-center flex-1">
                <button
                    className="cursor-target text-[2.8rem] font-black text-white mb-8 tracking-tight text-left select-none bg-transparent border-none p-0 cursor-pointer whitespace-nowrap"
                    aria-label="Scroll to top"
                    onClick={handleNameClick}
                >
                    Victor Wong
                    <div className="text-[#64ffda] font-mono text-lg mt-0.5 block min-h-[1.3em] tracking-tight font-semibold">
                        {typingText}
                    </div>
                </button>
                <nav className="w-full m-0 p-0">
                    <ul className="list-none p-0 m-0 flex flex-col items-start gap-8">
                        {navLinks.map(link => (
                            <li key={link.id} className="w-full">
                                <a
                                    href={`#${link.id}`}
                                    className={`cursor-target text-[#8892b0] text-lg font-bold tracking-wider no-underline relative flex items-center h-8 transition-colors duration-200 hover:text-[#64ffda] ${activeSection === link.id ? 'text-[#64ffda]' : ''
                                        }`}
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
                    <div className="flex flex-row gap-6 items-center mt-12 mb-6 relative">
                        {socials.map(s => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="cursor-target">
                                <img src={s.icon} alt={s.label} className="w-[26px] h-[26px] brightness-0 invert opacity-80 transition-all duration-200 hover:brightness-100 hover:saturate-150 hover:scale-110 hover:-translate-y-0.5 hover:opacity-100" />
                            </a>
                        ))}
                        <button
                            className="cursor-target bg-transparent border-none p-0 m-0 cursor-pointer brightness-0 invert opacity-80 transition-all duration-200 hover:brightness-100 hover:saturate-150 hover:scale-110 hover:-translate-y-0.5 hover:opacity-100"
                            aria-label="Copy email"
                            onClick={handleEmailClick}
                        >
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="M22 6 12 13 2 6" />
                            </svg>
                        </button>
                        {showTooltip && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#64ffda] text-[#0a192f] px-3 py-1 rounded text-xs whitespace-nowrap">Email copied!</span>}
                        <button
                            className="cursor-target inline-flex items-center justify-center text-[#64ffda] bg-[rgba(100,255,218,0.08)] border border-[#64ffda] text-xs font-medium px-3.5 py-2 rounded cursor-pointer ml-2 transition-all duration-200 hover:bg-[#64ffda] hover:text-[#0a192f] hover:scale-110 hover:-translate-y-0.5"
                            onClick={handleResumeDownload}
                            aria-label="Download Resume"
                        >
                            Resume
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default Navbar;
