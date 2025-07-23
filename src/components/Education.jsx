import React from 'react';

const Education = () => {
    return (
        <div className="education-section">
            <h2>Education</h2>
            <div className="education-card">
                <div className="education-header">
                    <span className="education-school">Union College</span>
                    <span className="education-degree">B.S. in Computer Science</span>
                </div>
                <div className="education-date">Expected June 2028</div>

                <div className="education-details">
                    <div className="education-section-detail">
                        <h4>Relevant Coursework</h4>
                        <p>Intro to Computer Science, Multivariable Calculus, Set Theory, Data Visualization</p>
                    </div>

                    <div className="education-section-detail">
                        <h4>Activities</h4>
                        <p>Goldman Sachs Possibilities Summit, CodePath Interview Prep, freeCodeCamp, ICPC</p>
                    </div>
                </div>
            </div>

            <div className="certificates-card">
                <h2>Certificates</h2>
                <div className="certificates-list">
                    <div className="certificate-item">
                        <span className="certificate-name">Colt Steele's Web Developer Bootcamp</span>
                    </div>
                    <div className="certificate-item">
                        <span className="certificate-name">ZTM's Data Science Bootcamp</span>
                    </div>
                    <div className="certificate-item">
                        <span className="certificate-name">VeritasAI Bootcamp</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Education; 