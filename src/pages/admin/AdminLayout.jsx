import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { PALETTE } from './adminTheme';

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
        <div className="min-h-screen flex" style={{ background: PALETTE.pageBg }}>
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader />
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
