import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';

const SIDEBAR_BG = '#114EC9';

// ── Icons — one per nav item, matching the Figma design's icon set ─────
const MonitorIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="18" x2="12" y2="21" />
    </svg>
);
const MapPinIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);
const GearIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);
const InfoCircleIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);
const CpuIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
        <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" />
    </svg>
);
const BadgeCheckIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 2.1 3.1-.4.9 3 2.6 1.7-1 3 1 3-2.6 1.7-.9 3-3.1-.4L12 22l-2.4-2.1-3.1.4-.9-3-2.6-1.7 1-3-1-3 2.6-1.7.9-3 3.1.4z" />
        <polyline points="9 12 11 14 15 10" />
    </svg>
);
const GridIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);
const MailIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2 6 12 13 22 6" />
    </svg>
);
const IdCardIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="8" cy="12" r="2" />
        <line x1="13" y1="10" x2="18" y2="10" /><line x1="13" y1="14" x2="18" y2="14" />
    </svg>
);
const PenBoxIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8.5 15.5l1-3.5 6-6 2.5 2.5-6 6-3.5 1z" />
    </svg>
);

// ── Nav items — order/labels match the Figma design's sidebar exactly ──
const NAV_ITEMS = [
    { id: 'intimation', label: 'Intimation', path: ROUTES.INTIMATION.BASE, Icon: MonitorIcon, end: true },
    { id: 'surveyor-allocation', label: 'Surveyor Allocation', path: ROUTES.INTIMATION.SURVEYOR_APPOINTMENT, Icon: MapPinIcon },
    { id: 'handler', label: 'Handler', path: ROUTES.INTIMATION.CLAIM_HANDLER, Icon: GearIcon },
    { id: 'claim-details', label: 'Claim Details', path: ROUTES.INTIMATION.CLAIM_DETAILS, Icon: InfoCircleIcon },
    { id: 'ai-ila', label: 'AI ILA', path: ROUTES.INTIMATION.AI_ILA, Icon: CpuIcon },
    { id: 'annotation-studio', label: 'Annotation Studio', path: ROUTES.INTIMATION.ANNOTATION_STUDIO, Icon: PenBoxIcon },
    { id: 'ila-new', label: 'ILA - New', path: ROUTES.INTIMATION.ILA_NEW, Icon: BadgeCheckIcon },
    { id: 'fla', label: 'FLA', path: ROUTES.INTIMATION.FLA, Icon: GridIcon },
    { id: 'recommendation', label: 'Recommendation', path: ROUTES.INTIMATION.RECOMMENDATION, Icon: MailIcon },
    { id: 'fee-bill', label: 'Fee Bill', path: ROUTES.INTIMATION.FEE_BILL, Icon: IdCardIcon },
];

const IntimationSidebar = ({ open }) => (
    <aside
        className={`admin-sidebar im-sidebar flex flex-col${open ? ' im-sidebar-open' : ''}`}
        style={{ width: 200, background: SIDEBAR_BG, color: '#fff', flexShrink: 0 }}
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
