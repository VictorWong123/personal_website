import React from 'react';
import { useNavigate } from 'react-router-dom';

const allProjects = [
    {
        title: 'ShopNSplit',
        url: 'https://github.com/VictorWong123/shopNsplit',
        description:
            'Full-stack app that automates group grocery splitting. Users input shared and personal items to generate accurate cost breakdowns. Integrated Mistral AI for receipt scanning.',
        tech: ['React', 'JavaScript', 'Tailwind CSS', 'Passport.js', 'Mistral AI'],
    },
    {
        title: 'LifeCents',
        url: 'https://github.com/VictorWong123/LifeCents',
        description:
            'Chrome extension that converts online prices into estimated work time based on hourly wage. Uses DOM scraping to dynamically detect and replace prices across websites.',
        tech: ['JavaScript', 'HTML', 'CSS'],
    },
    {
        title: 'Spotify-Wrapped',
        url: 'https://github.com/VictorWong123/spotify-wrapped',
        description:
            'Web app that generates 10+ interactive visualizations of Spotify listening data. Features secure login, personalized charts, and a compatibility score for comparing music tastes.',
        tech: ['React', 'Node.js', 'D3.js', 'Auth0', 'JavaScript', 'HTML', 'CSS'],
    },
    {
        title: 'Personal Website',
        url: 'https://github.com/VictorWong123/personal_website',
        description: 'A responsive personal portfolio website built with React and Vite. Features a modern design, smooth animations, and interactive elements.',
        tech: ['React', 'Vite', 'CSS'],
    },
    {
        title: 'Data Analysis Dashboard',
        url: '',
        description: 'Interactive dashboard for analyzing and visualizing data using Python with pandas, matplotlib, and numpy. Includes statistical analysis and data cleaning capabilities.',
        tech: ['Python', 'Pandas', 'Matplotlib'],
    },
    {
        title: 'Web Application',
        url: '',
        description: 'Full-stack web application built with React frontend and Node.js backend. Features user authentication, database integration, and RESTful API design.',
        tech: ['React', 'Node.js', 'MongoDB'],
    },
    {
        title: 'Placeholder Project 1',
        url: '',
        description: 'This is a placeholder for an additional project. Add your real projects here!',
        tech: ['Placeholder', 'Demo'],
    },
    {
        title: 'Placeholder Project 2',
        url: '',
        description: 'Another placeholder project. You can add as many as you want.',
        tech: ['React', 'API'],
    },
];

const AllProjects = () => {
    const navigate = useNavigate();
    return (
        <div className="projects-section">
            <button className="view-all-projects" style={{ marginBottom: 24 }} onClick={() => navigate('/')}>← Back to Home</button>
            <h2>All Projects</h2>
            <div className="projects-list">
                {allProjects.map((project, idx) => (
                    <div className="project-card compact" key={project.title + idx}>
                        <div className="project-header">
                            <span className="project-title">{project.title}</span>
                            {project.url && (
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="card-link-icon"
                                    aria-label="View on GitHub"
                                    tabIndex={-1}
                                >
                                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </a>
                            )}
                        </div>
                        <div className="project-desc">{project.description}</div>
                        <div className="project-tech">
                            {project.tech.map(t => (
                                <span className="tech-pill" key={t}>{t}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllProjects; 