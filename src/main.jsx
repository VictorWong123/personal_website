import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const legacyRoute = window.location.hash.slice(1);
const legacyRoutes = new Set(['/work', '/projects', '/secrets']);

if (legacyRoutes.has(legacyRoute)) {
    window.history.replaceState(null, '', legacyRoute);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
