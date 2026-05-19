import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import '../admin.css';

// ── System options ────────────────────────────────────────────────────
const SYSTEMS = [
    {
        id: 'super-admin',
        title: 'SUPER-ADMIN DASHBOARD',
        subtitle: 'Full system control — users, claims, reports & configuration',
        gradient: 'linear-gradient(135deg, #0B2D9B 0%, #1e4fd8 100%)',
        shadow: 'rgba(11,45,155,0.40)',
        hoverGradient: 'linear-gradient(135deg, #0a2688 0%, #1844c2 100%)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
        ),
        route: ROUTES.ADMIN.LOGIN,
        badge: null,
    },
    {
        id: 'insurer',
        title: 'INSURER',
        subtitle: 'Survey & Claims System',
        gradient: 'linear-gradient(135deg, #0369A1 0%, #0ea5e9 100%)',
        shadow: 'rgba(3,105,161,0.38)',
        hoverGradient: 'linear-gradient(135deg, #025d8f 0%, #0d95d4 100%)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
        route: ROUTES.ADMIN.LOGIN,
        badge: null,
    },
    {
        id: 'broker',
        title: 'BROKER',
        subtitle: 'Survey & Claims System',
        gradient: 'linear-gradient(135deg, #0F766E 0%, #14b8a6 100%)',
        shadow: 'rgba(15,118,110,0.38)',
        hoverGradient: 'linear-gradient(135deg, #0d6560 0%, #12a496 100%)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
            </svg>
        ),
        route: ROUTES.ADMIN.LOGIN,
        badge: null,
    },
    {
        id: 'surveyor',
        title: 'SURVEYOR',
        subtitle: 'Survey & Claims System',
        gradient: 'linear-gradient(135deg, #7C3AED 0%, #a855f7 100%)',
        shadow: 'rgba(124,58,237,0.38)',
        hoverGradient: 'linear-gradient(135deg, #6d31d4 0%, #9741e0 100%)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
        ),
        route: ROUTES.ADMIN.LOGIN,
        badge: null,
    },
    {
        id: 'workshop',
        title: 'WORKSHOP',
        subtitle: 'Survey & Claims System',
        gradient: 'linear-gradient(135deg, #B45309 0%, #f59e0b 100%)',
        shadow: 'rgba(180,83,9,0.38)',
        hoverGradient: 'linear-gradient(135deg, #9e4908 0%, #dc8f0a 100%)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        ),
        route: ROUTES.ADMIN.LOGIN,
        badge: null,
    },
    {
        id: 'intimation',
        title: 'INTIMATION MANAGEMENT',
        subtitle: 'Claim notification & intimation tracking',
        gradient: 'linear-gradient(135deg, #BE185D 0%, #ec4899 100%)',
        shadow: 'rgba(190,24,93,0.38)',
        hoverGradient: 'linear-gradient(135deg, #a8175a 0%, #d4408a 100%)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
        ),
        route: ROUTES.INTIMATION.BASE,
        badge: null,
    },
];

// ── Card ──────────────────────────────────────────────────────────────
const SystemCard = ({ system, onSelect }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={() => onSelect(system)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: '100%',
                background: hovered ? system.hoverGradient : system.gradient,
                border: 'none',
                borderRadius: 14,
                padding: '22px 28px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                boxShadow: hovered
                    ? `0 10px 32px ${system.shadow}`
                    : `0 4px 16px ${system.shadow}`,
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.18s ease',
                fontFamily: 'inherit',
                textAlign: 'left',
            }}
        >
            {/* Left: icon + text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: 'rgba(255,255,255,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', flexShrink: 0,
                }}>
                    {system.icon}
                </div>
                <div>
                    <div style={{ color: '#fff', fontSize: 15, fontWeight: 800, letterSpacing: '0.03em', lineHeight: 1.2 }}>
                        {system.title}
                    </div>
                    {system.subtitle && (
                        <div style={{ color: 'rgba(255,255,255,0.78)', fontSize: 12.5, marginTop: 4, fontWeight: 500 }}>
                            {system.subtitle}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: arrow */}
            <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', flexShrink: 0,
                transition: 'background 0.18s',
            }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                </svg>
            </div>
        </button>
    );
};

// ── Page ──────────────────────────────────────────────────────────────
const AdminSelectPage = () => {
    const navigate = useNavigate();

    const handleSelect = (system) => {
        navigate(system.route, { state: { systemId: system.id, systemTitle: system.title } });
    };

    return (
        <div
            className="admin-root"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(160deg, #0B1F6B 0%, #1a3a9e 45%, #2a5298 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 16px',
            }}
        >
            {/* Header text */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{
                    width: 64, height: 64, borderRadius: 16,
                    background: 'rgba(255,255,255,0.12)',
                    border: '1.5px solid rgba(255,255,255,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <h1 style={{
                    color: '#fff', fontSize: 30, fontWeight: 800, margin: 0,
                    letterSpacing: '-0.01em', lineHeight: 1.2,
                }}>
                    Insurance Management Portal
                </h1>
                <p style={{
                    color: 'rgba(255,255,255,0.65)', fontSize: 14,
                    marginTop: 10, fontWeight: 500,
                }}>
                    Select a system to continue
                </p>
            </div>

            {/* Cards grid */}
            <div style={{
                width: '100%', maxWidth: 680,
                display: 'flex', flexDirection: 'column', gap: 14,
            }}>
                {SYSTEMS.map((system) => (
                    <SystemCard key={system.id} system={system} onSelect={handleSelect} />
                ))}
            </div>

            {/* Footer */}
            <p style={{
                color: 'rgba(255,255,255,0.35)', fontSize: 11,
                marginTop: 36, textAlign: 'center',
            }}>
                © 2026 · Insurance Management System · All rights reserved
            </p>
        </div>
    );
};

export default AdminSelectPage;
