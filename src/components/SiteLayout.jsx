import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const SiteLayout = () => (
    <div className="site-shell">
        <Header />
        <main className="site-main">
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default SiteLayout;
