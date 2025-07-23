import React from 'react';

const Skills = () => {
    const skillCategories = [
        {
            title: 'Programming Languages',
            skills: ['Python', 'JavaScript', 'R'],
            color: '#ff6b6b' // Red
        },
        {
            title: 'Databases',
            skills: ['MongoDB', 'SQL', 'Postgres'],
            color: '#4ecdc4' // Mint
        },
        {
            title: 'Frameworks & Libraries',
            skills: ['React', 'Next.js', 'Express.js', 'Node.js', 'Tailwind', 'D3', 'Pandas', 'Matplotlib'],
            color: '#45b7d1' // Blue
        },
        {
            title: 'Other',
            skills: ['HTML', 'CSS', 'Git', 'Figma', 'Heroku', 'Data Structures and Algorithms'],
            color: '#96ceb4' // Green
        }
    ];

    return (
        <div className="skills-section">
            <h2>Skills</h2>
            <div className="skills-grid">
                {skillCategories.map((category, idx) => (
                    <div
                        className="skill-category"
                        key={idx}
                        style={{
                            borderColor: `${category.color}30`,
                            borderLeft: `3px solid ${category.color}`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = category.color;
                            e.currentTarget.style.boxShadow = `0 8px 32px 0 ${category.color}20, 0 2px 12px 0 rgba(2, 12, 27, 0.18)`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = `${category.color}30`;
                            e.currentTarget.style.boxShadow = '0 2px 12px 0 rgba(2, 12, 27, 0.12)';
                        }}
                    >
                        <h4 style={{ color: category.color }}>{category.title}</h4>
                        <div className="skill-list">
                            {category.skills.map((skill, skillIdx) => (
                                <span
                                    className="skill-pill"
                                    key={skillIdx}
                                    style={{
                                        backgroundColor: `${category.color}15`,
                                        color: category.color,
                                        border: `1px solid ${category.color}30`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = category.color;
                                        e.target.style.color = '#0a192f';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = `${category.color}15`;
                                        e.target.style.color = category.color;
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Skills; 