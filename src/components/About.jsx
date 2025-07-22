import React, { useState, useEffect } from 'react';

const experience = [
    {
        company: 'Union College',
        title: 'Research Assistant',
        date: 'Oct 2024 — Present',
        description: 'I helped design and launch the first-ever website for Union College’s CAP Lab using Next.js and Tailwind CSS. The site showcases our research and connects us with the broader academic community. My work involved studying gesture-based interactions with MediaPipe, reviewing over 10 UI/UX research papers, and applying those insights to improve user experience. I collaborated in an 8-person team using GitHub and weekly design reviews to keep progress on track.',
        tech: ['Next.js', 'Tailwind CSS', 'MediaPipe', 'Javascript', 'Research'],
    },
    {
        company: 'EpiBuild',
        title: 'Software Developer',
        date: 'Feb 2025 — Jun 2025',
        description: 'I built three interactive D3.js visualizations of over 20,000 woodworking sales records, which sped up analysis by 20%. I also implemented user authentication using Passport.js to protect internal dashboards and helped design the interface in Figma. Our 3-person team deployed the app on Heroku and integrated Amazon S3 to handle 2GB of historical data.',
        tech: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'D3'],
    },
];

const titles = ['Software Engineer', 'Student', 'Data Scientist'];

const About = () => {
    const [typingText, setTypingText] = useState('');
    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

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

    return (
        <div className="about-section">
            <h1>Victor Wong</h1>
            <span className="about-typing">{typingText}</span>
            <p>I build data-driven, accessible digital experiences for the web and beyond.</p>
            <p>
                I'm a data scientist, software engineer, and student researcher at Union College ('28). I have 4 years of experience in Python, from web development with Flask to data science with matplotlib, numpy, and pandas. In 2024, I dove into web development with HTML, CSS, JavaScript, and React. I love building meaningful projects and collaborating with others.
            </p>
            <p>
                Outside of tech, I enjoy anime (Vinland Saga is my favorite), ping pong, and chess.
            </p>
            <h2>Work Experience</h2>
            <div className="experience-list">
                {experience.map((job, idx) => (
                    <div className="experience-card" key={job.company + idx}>
                        <div className="experience-date">{job.date}</div>
                        <div className="experience-header">
                            <span className="experience-title">{job.title}</span>{' '}
                            <span className="experience-company">
                                {job.company}
                            </span>
                        </div>
                        <div className="experience-desc">{job.description}</div>
                        <div className="experience-tech">
                            {job.tech.map(t => (
                                <span className="tech-pill" key={t}>{t}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default About; 