import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Section reveal animation logic
function setupSectionReveal() {
    const revealSections = document.querySelectorAll('.main-sections > section');
    revealSections.forEach(section => section.classList.add('section-reveal'));
    const observer = new window.IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );
    revealSections.forEach(section => observer.observe(section));
}

// Cursor spotlight effect
if (!document.getElementById('cursor-spotlight')) {
    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    spotlight.id = 'cursor-spotlight';
    document.body.appendChild(spotlight);
    window.addEventListener('mousemove', (e) => {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Wait for React to render, then setup section reveal
setTimeout(setupSectionReveal, 100); 