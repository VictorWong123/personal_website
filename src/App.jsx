import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import Home from './pages/Home';
import Work from './pages/Work';
import Projects from './pages/Projects';
import ThemedNotFound from './pages/ThemedNotFound';

const SecretsExperience = lazy(() => import('./secrets/SecretsExperience'));

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<SiteLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/work" element={<Work />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="*" element={<ThemedNotFound />} />
                </Route>
                <Route
                    path="/secrets"
                    element={(
                        <Suspense fallback={(
                            <main style={{
                                alignItems: 'center',
                                background: '#030608',
                                color: '#e5ecea',
                                display: 'flex',
                                flexDirection: 'column',
                                fontFamily: 'IBM Plex Mono, monospace',
                                gap: '20px',
                                justifyContent: 'center',
                                minHeight: '100svh',
                            }}>
                                <p role="status">Loading 3D portfolio…</p>
                                <a href="/" style={{ color: 'inherit' }}>Exit to main portfolio</a>
                            </main>
                        )}>
                            <SecretsExperience />
                        </Suspense>
                    )}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
