import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';

const SIDEBAR_BG = '#114EC9';

// ── Icons ─────────────────────────────────────────────────────────────
const GridIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);
const DocIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="13" y2="16" />
    </svg>
);

// ── Nav items ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { id: 'intimation', label: 'Intimation', path: ROUTES.INTIMATION.BASE, Icon: GridIcon, end: true },
    { id: 'claim-handler', label: 'Claim Handler', path: ROUTES.INTIMATION.CLAIM_HANDLER, Icon: DocIcon },
    { id: 'surveyor-appointment', label: 'Surveyor Ap....', path: ROUTES.INTIMATION.SURVEYOR_APPOINTMENT, Icon: DocIcon },
    { id: 'claim-details', label: 'Claim Details', path: ROUTES.INTIMATION.CLAIM_DETAILS, Icon: DocIcon },
    { id: 'ila', label: 'ILA', path: ROUTES.INTIMATION.ILA, Icon: DocIcon },
    { id: 'settlement', label: 'Settlement', path: ROUTES.INTIMATION.SETTLEMENT, Icon: DocIcon },
    { id: 'fla', label: 'FLA', path: ROUTES.INTIMATION.FLA, Icon: DocIcon },
    { id: 'recommendation', label: 'Recommen....', path: ROUTES.INTIMATION.RECOMMENDATION, Icon: DocIcon },
    { id: 'dms-surveyor', label: 'Dms surveyor', path: ROUTES.INTIMATION.DMS_SURVEYOR, Icon: DocIcon },
    { id: 'dms-preinspection', label: 'Dms pre-inspe...', path: ROUTES.INTIMATION.DMS_PREINSPECTION, Icon: DocIcon },
];

const IntimationSidebar = () => (
    <aside
        className="admin-sidebar flex flex-col"
        style={{ width: 172, background: SIDEBAR_BG, color: '#fff', flexShrink: 0 }}
    >
        <div style={{ height: 54 }} />
        <nav>
            {NAV_ITEMS.map(({ id, label, path, Icon, end }) => (
                <NavLink
                    key={id}
                    to={path}
                    end={end}
                    className={({ isActive }) => `admin-sidebar-item${isActive ? ' is-active' : ''}`}
                    style={{ textDecoration: 'none' }}
                >
                    {({ isActive }) => (
                        <>
                            <Icon size={16} color={isActive ? '#fff' : 'rgba(255,255,255,0.8)'} />
                            <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {label}
                            </span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    </aside>
);

export default IntimationSidebar;
