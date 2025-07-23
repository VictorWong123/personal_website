import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import Projects from './components/Projects';
import AllProjects from './components/AllProjects';
import Resume from './components/Resume';
import Education from './components/Education';
import Skills from './components/Skills';
import './styles.css';

function App() {
    return (
        <Router>
            <div className="centered-container">
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={
                            <>
                                <section id="about"><About /></section>
                                <section id="education"><Education /></section>
                                <section id="projects"><Projects /></section>
                                <section id="skills"><Skills /></section>

                            </>
                        } />
                        <Route path="/projects" element={<AllProjects />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App; 