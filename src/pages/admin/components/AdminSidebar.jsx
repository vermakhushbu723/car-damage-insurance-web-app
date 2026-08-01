import React from 'react';
import { NavLink } from 'react-router-dom';
import { PALETTE } from '../adminTheme';
import {
    DashboardIcon,
    SettingsIcon,
    HeadphonesIcon,
    InternalUserIcon,
    InsurerIcon,
    BrokerIcon,
    SurveyorIcon,
    WorkshopIcon,
} from './AdminIcons';
import { ROUTES } from '../../../constants/routes';

// ── Sidebar nav config ─────────────────────────────────────────────────
const PRIMARY_NAV = [
    { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon, path: ROUTES.ADMIN.DASHBOARD },
    { id: 'internal-user', label: 'Internal User', Icon: InternalUserIcon, path: ROUTES.ADMIN.USER_CREATION },
    { id: 'insurer', label: 'Insurer', Icon: InsurerIcon, path: ROUTES.ADMIN.INSURER },
    { id: 'broker', label: 'Broker', Icon: BrokerIcon, path: ROUTES.ADMIN.BROKER },
    { id: 'surveyor', label: 'Surveyor', Icon: SurveyorIcon, path: ROUTES.ADMIN.SURVEYOR },
    { id: 'workshop', label: 'Workshop', Icon: WorkshopIcon, path: ROUTES.ADMIN.WORKSHOP },
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
const AdminSidebar = ({ open }) => {
    return (
        <aside
            className={`admin-sidebar ad-sidebar flex flex-col${open ? ' ad-sidebar-open' : ''}`}
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
