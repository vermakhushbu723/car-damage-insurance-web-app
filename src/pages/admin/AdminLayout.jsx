import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { PALETTE } from './adminTheme';
// Side-effect import: loads Instrument Sans + defines `.admin-root` so
// every nested admin route inherits the admin typography.
import './admin.css';

/**
 * Shared layout for every /admin/* page (except /admin/login which keeps
 * its own full-bleed layout). Renders the sidebar + top bar around an
 * <Outlet /> so each route only has to supply its page content.
 *
 *   ┌──────────┬──────────────────────────────────────────────────┐
 *   │ Sidebar  │  Header                                          │
 *   │          ├──────────────────────────────────────────────────┤
 *   │          │  <Outlet />  ← page content                      │
 *   └──────────┴──────────────────────────────────────────────────┘
 *
 * On tablet/mobile (<=1024px) the sidebar becomes an off-canvas drawer
 * toggled by a hamburger button in the header (see admin.css `.ad-*`
 * rules) instead of squeezing into a narrow viewport.
 */
const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const contentRef = useRef(null);

    useEffect(() => {
        // Close the off-canvas sidebar automatically after navigating
        // (mobile/tablet) -- otherwise it stays open covering the page.
        setSidebarOpen(false);
        // The scrollable element is this inner div, not the window (the
        // layout root is overflow:hidden) -- reset it on every route
        // change so a new page always opens at the top.
        contentRef.current?.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div
            className="admin-root"
            style={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
                background: PALETTE.pageBg,
            }}
        >
            <div
                className={`ad-sidebar-overlay${sidebarOpen ? ' ad-sidebar-open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar — fixed width, full viewport height, never scrolls */}
            <AdminSidebar open={sidebarOpen} />

            {/* Right pane: sticky header + scrollable content */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                {/* Header stays fixed at top */}
                <div style={{ flexShrink: 0 }}>
                    <AdminHeader onMenuClick={() => setSidebarOpen((o) => !o)} />
                </div>

                {/* Only this area scrolls */}
                <div ref={contentRef} style={{ flex: 1, overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
