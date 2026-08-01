import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import IntimationSidebar from './components/IntimationSidebar';
import IntimationHeader from './components/IntimationHeader';
import '../admin.css';

const IntimationLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const contentRef = useRef(null);

    useEffect(() => {
        // Close the off-canvas sidebar automatically after navigating
        // (mobile/tablet) -- otherwise it stays open covering the page you
        // just chose.
        setSidebarOpen(false);
        // The scrollable element is this inner div, not the window (the
        // layout root is overflow:hidden) -- reset it on every route change
        // so a new page always opens at the top instead of wherever the
        // previous page happened to be scrolled to.
        contentRef.current?.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div
            className="admin-root im-layout-root"
            style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFD' }}
        >
            <div
                className={`im-sidebar-overlay${sidebarOpen ? ' im-sidebar-open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />
            <IntimationSidebar open={sidebarOpen} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
                <div style={{ flexShrink: 0 }}>
                    <IntimationHeader onMenuClick={() => setSidebarOpen((o) => !o)} />
                </div>
                <div ref={contentRef} style={{ flex: 1, overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default IntimationLayout;
