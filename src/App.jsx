import React from 'react';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import Home from './pages/Home';
import Work from './pages/Work';
import Projects from './pages/Projects';
import ThemedNotFound from './pages/ThemedNotFound';

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<SiteLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/work" element={<Work />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/about" element={<Navigate to="/" replace />} />
                    <Route path="/contact" element={<Navigate to="/" replace />} />
                    <Route path="/Experience" element={<Navigate to="/work" replace />} />
                    <Route path="*" element={<ThemedNotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
