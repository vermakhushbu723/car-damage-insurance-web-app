import React from 'react';
import { NavLink } from 'react-router-dom';
import { PALETTE } from '../adminTheme';
import {
    DashboardIcon,
    DocIcon,
    SettingsIcon,
    HeadphonesIcon,
    UserPlusIcon,
} from './AdminIcons';
import { ROUTES } from '../../../constants/routes';

// ── Sidebar nav config ─────────────────────────────────────────────────
const PRIMARY_NAV = [
    { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon, path: ROUTES.ADMIN.DASHBOARD },
    { id: 'claim', label: 'Claim insure', Icon: DocIcon, path: ROUTES.ADMIN.CLAIM },
    { id: 'preinspection', label: 'Preinspection', Icon: DocIcon, path: ROUTES.ADMIN.PREINSPECTION },
    { id: 'user-creation', label: 'User Creation', Icon: UserPlusIcon, path: ROUTES.ADMIN.USER_CREATION },
];

const SECONDARY_NAV = [
    { id: 'settings', label: 'Settings', Icon: SettingsIcon, path: ROUTES.ADMIN.SETTINGS },
    { id: 'support', label: 'Support', Icon: HeadphonesIcon, path: ROUTES.ADMIN.SUPPORT },
];

const SidebarItem = ({ item }) => {
    return (
        <NavLink
            to={item.path}
            className={({ isActive }) => `admin-sidebar-item${isActive ? ' is-active' : ''}`}
        >
            {({ isActive }) => (
                <>
                    <item.Icon size={18} color={isActive ? PALETTE.sidebarActiveText : PALETTE.sidebarText} />
                    <span>{item.label}</span>
                </>
            )}
        </NavLink>
    );
};

/**
 * Admin panel sidebar.
 *
 * Active state is derived from the current URL so it stays in sync when
 * the user navigates between admin sub-routes (back/forward, deep link,
 * etc.). Items without a `path` yet are placeholders — clicking them is
 * a no-op until those routes are built.
 */
const AdminSidebar = () => {
    return (
        <aside
            className="admin-sidebar flex flex-col"
            style={{
                width: 166,
                background: PALETTE.sidebar,
                color: '#fff',
                flexShrink: 0,
            }}
        >
            {/* logo / brand slot */}
            <div style={{ height: 53 }} />

            {/* primary nav */}
            <nav style={{ paddingTop: 0 }}>
                {PRIMARY_NAV.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
            </nav>

            {/* spacer pushes secondary nav to bottom */}
            <div style={{ flex: 1 }} />

            {/* secondary nav */}
            <nav style={{ paddingBottom: 24 }}>
                {SECONDARY_NAV.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
