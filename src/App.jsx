import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import Home from './pages/Home';
import Work from './pages/Work';
import Projects from './pages/Projects';
import ThemedNotFound from './pages/ThemedNotFound';

const Notebook = lazy(() => import('./pages/Notebook'));

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
                        <Suspense fallback={null}>
                            <Notebook />
                        </Suspense>
                    )}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
