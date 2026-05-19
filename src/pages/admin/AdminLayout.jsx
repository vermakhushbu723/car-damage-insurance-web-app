import React from 'react';
import { Outlet } from 'react-router-dom';
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
 */
const AdminLayout = () => {
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
            {/* Sidebar — fixed width, full viewport height, never scrolls */}
            <AdminSidebar />

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
                    <AdminHeader />
                </div>

                {/* Only this area scrolls */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
