import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PALETTE } from '../adminTheme';
import {
    DashboardIcon,
    DocIcon,
    SettingsIcon,
    HeadphonesIcon,
} from './AdminIcons';
import { ROUTES } from '../../../constants/routes';

// ── Sidebar nav config ─────────────────────────────────────────────────
const PRIMARY_NAV = [
    { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon, path: ROUTES.ADMIN.DASHBOARD },
    { id: 'claim', label: 'Claim insure', Icon: DocIcon, path: null },
    { id: 'preinspection', label: 'Preinspection', Icon: DocIcon, path: null },
];

const SECONDARY_NAV = [
    { id: 'settings', label: 'Settings', Icon: SettingsIcon, path: null },
    { id: 'support', label: 'Support', Icon: HeadphonesIcon, path: null },
];

const SidebarItem = ({ item, active, onClick }) => {
    const isActive = active === item.id;
    return (
        <button
            onClick={() => onClick(item)}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 24px',
                background: isActive ? '#fff' : 'transparent',
                color: isActive ? PALETTE.sidebarActiveText : '#fff',
                border: 'none',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                borderTopRightRadius: isActive ? 24 : 0,
                borderBottomRightRadius: isActive ? 24 : 0,
                transition: 'background 0.15s',
            }}
        >
            <item.Icon size={18} color={isActive ? PALETTE.sidebarActiveText : '#fff'} />
            <span>{item.label}</span>
        </button>
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
    const navigate = useNavigate();
    const location = useLocation();

    // Map URL → nav id. Defaults to 'dashboard' for any unrecognised
    // admin sub-path so something is always highlighted.
    const activeId = (() => {
        const p = location.pathname;
        if (p.startsWith('/admin/claim')) return 'claim';
        if (p.startsWith('/admin/preinspection')) return 'preinspection';
        if (p.startsWith('/admin/settings')) return 'settings';
        if (p.startsWith('/admin/support')) return 'support';
        return 'dashboard';
    })();

    const handleNavClick = (item) => {
        if (item.path) navigate(item.path);
        // TODO: wire claim / preinspection / settings / support routes
        // here as those pages get built.
    };

    return (
        <aside
            className="flex flex-col"
            style={{
                width: 220,
                background: PALETTE.sidebar,
                color: '#fff',
                flexShrink: 0,
            }}
        >
            {/* logo / brand slot */}
            <div style={{ height: 64 }} />

            {/* primary nav */}
            <nav style={{ paddingTop: 8 }}>
                {PRIMARY_NAV.map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        active={activeId}
                        onClick={handleNavClick}
                    />
                ))}
            </nav>

            {/* spacer pushes secondary nav to bottom */}
            <div style={{ flex: 1 }} />

            {/* secondary nav */}
            <nav style={{ paddingBottom: 24 }}>
                {SECONDARY_NAV.map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        active={activeId}
                        onClick={handleNavClick}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
