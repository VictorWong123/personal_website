import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import Projects from './components/Projects';
import AllProjects from './components/AllProjects';
import Resume from './components/Resume';
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
                                <section id="projects"><Projects /></section>
                                <section id="contact"><Resume /></section>
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