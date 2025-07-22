import React from 'react';
import { useNavigate } from 'react-router-dom';

const projects = [
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
];

const Projects = () => {
    const navigate = useNavigate();
    return (
        <div className="projects-section">
            <h2>Projects</h2>
            <div className="projects-list">
                {projects.map((project, idx) => (
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
            <button className="view-all-projects" onClick={() => navigate('/projects')}>
                View All Projects <span aria-hidden>→</span>
            </button>
        </div>
    );
};

export default Projects; 