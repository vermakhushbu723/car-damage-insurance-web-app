import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PALETTE } from '../../adminTheme';
import { SearchIcon, BellIcon, UserIcon } from '../../components/AdminIcons';
import { ROUTES } from '../../../../constants/routes';

const IconButton = ({ children, ariaLabel, onClick }) => (
    <button onClick={onClick} aria-label={ariaLabel} style={{
        width: 36, height: 36, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F1F5F9', border: '1px solid #E2E8F0',
        borderRadius: '50%', cursor: 'pointer',
    }}>
        {children}
    </button>
);

const HamburgerIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

/**
 * Top bar for every /admin/intimation/* screen. `onMenuClick` opens the
 * off-canvas sidebar on tablet/mobile (see IntimationLayout.jsx) -- the
 * button itself only renders on those breakpoints (`.im-hamburger` in
 * admin.css), so it doesn't take up space on laptop/desktop where the
 * sidebar is already static.
 */
const IntimationHeader = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    return (
        <header className="flex items-center px-6" style={{ background: PALETTE.topbar, height: 54, gap: 12, paddingLeft: 16, paddingRight: 16 }}>
            <button
                className="im-hamburger"
                onClick={onMenuClick}
                aria-label="Toggle navigation menu"
                style={{
                    width: 36, height: 36, flexShrink: 0, alignItems: 'center', justifyContent: 'center',
                    background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer',
                }}
            >
                <HamburgerIcon />
            </button>

            <div className="im-header-search" style={{ position: 'relative', width: 320, maxWidth: '50%', minWidth: 0 }}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    style={{
                        width: '100%', padding: '8px 38px 8px 14px', boxSizing: 'border-box',
                        background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8,
                        fontSize: 13, outline: 'none', color: PALETTE.body,
                    }}
                />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                    <SearchIcon />
                </span>
            </div>

            <div style={{ flex: 1 }} />

            <div className="flex items-center gap-3">
                <IconButton ariaLabel="Notifications"><BellIcon /></IconButton>
                <IconButton ariaLabel="Profile" onClick={() => navigate(ROUTES.ADMIN.SELECT)}><UserIcon /></IconButton>
            </div>
        </header>
    );
};

export default IntimationHeader;
