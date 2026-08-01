import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PALETTE } from '../adminTheme';
import {
    SearchIcon,
    BellIcon,
    HeadphonesIcon,
    UserIcon,
} from './AdminIcons';
import { ROUTES } from '../../../constants/routes';

const IconButton = ({ children, ariaLabel, onClick }) => (
    <button
        onClick={onClick}
        aria-label={ariaLabel}
        style={{
            width: 38, height: 38, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
            borderRadius: '50%',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

const HamburgerIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

/**
 * Admin panel top bar — search + notification / support / profile icons.
 *
 * The Profile icon currently routes back to the admin login page (signs
 * the admin out, effectively); swap for a proper menu once real auth is
 * wired up. `onMenuClick` opens the off-canvas sidebar on tablet/mobile
 * (see AdminLayout.jsx) -- the hamburger button itself only renders on
 * those breakpoints (`.ad-hamburger` in admin.css).
 */
const AdminHeader = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    return (
        <header
            className="flex items-center px-6"
            style={{
                background: PALETTE.topbar,
                height: 64,
                gap: 12,
            }}
        >
            <button
                className="ad-hamburger"
                onClick={onMenuClick}
                aria-label="Toggle navigation menu"
                style={{
                    width: 38, height: 38, flexShrink: 0, alignItems: 'center', justifyContent: 'center',
                    background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer',
                }}
            >
                <HamburgerIcon />
            </button>

            {/* Search */}
            <div className="ad-header-search" style={{ position: 'relative', width: 360, maxWidth: '50%', minWidth: 0 }}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    style={{
                        width: '100%',
                        padding: '10px 40px 10px 16px',
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none',
                        color: PALETTE.body,
                    }}
                />
                <span
                    style={{
                        position: 'absolute',
                        right: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    <SearchIcon />
                </span>
            </div>

            {/* spacer */}
            <div style={{ flex: 1 }} />

            {/* right side icons */}
            <div className="flex items-center gap-3">
                <IconButton ariaLabel="Notifications">
                    <BellIcon />
                </IconButton>
                <IconButton ariaLabel="Support">
                    <HeadphonesIcon />
                </IconButton>
                <IconButton ariaLabel="Profile" onClick={() => navigate(ROUTES.ADMIN.LOGIN)}>
                    <UserIcon />
                </IconButton>
            </div>
        </header>
    );
};

export default AdminHeader;
