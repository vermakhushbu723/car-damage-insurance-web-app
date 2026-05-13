import React from 'react';
import { PALETTE } from '../adminTheme';
import { CompassIcon, ArrowRight } from '../components/AdminIcons';

/**
 * Admin Panel — Dashboard content.
 */

// ── Reusable bits (kept local — only used on this page) ───────────────
const Card = ({ children, style }) => (
    <div
        className="bg-white"
        style={{
            border: `1px solid ${PALETTE.cardBorder}`,
            borderRadius: 7,
            padding: 20,
            boxShadow: '0px 1px 4px 0px #00000040',
            ...style,
        }}
    >
        {children}
    </div>
);

const Badge = ({ children }) => (
    <span
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            border: `1px solid ${PALETTE.badgeBorder}`,
            background: PALETTE.badgeBg,
            color: PALETTE.badgeText,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
        }}
    >
        {children}
    </span>
);

const PrimaryButton = ({ children, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 18px',
            background: PALETTE.primaryBlue,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

const CardTopIcon = () => (
    <div
        style={{
            width: 28, height: 28,
            borderRadius: 6,
            background: '#BFDBFE',
            border: '1px solid #93C5FD',
        }}
    />
);

const AdminDashboardPage = () => {
    return (
        <main className="p-8" style={{ flex: 1 }}>
            {/* Heading */}
            <h1
                style={{
                    color: PALETTE.primaryBlue,
                    fontSize: 32,
                    fontWeight: 800,
                    margin: 0,
                    marginBottom: 14,
                }}
            >
                Dashboard
            </h1>
            <p style={{ color: PALETTE.body, fontSize: 14, fontWeight: 600, margin: 0 }}>
                Welcome to the central command for the architectural sanctuary motor insurance
            </p>
            <p style={{ color: PALETTE.body, fontSize: 14, fontWeight: 600, margin: 0, marginBottom: 24 }}>
                System motor claims, manage insurer partnerships, &amp; ocersee system performance
            </p>

            {/* ── Top row: Claim + Preinspection ─────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                {/* Claim card */}
                <Card>
                    <div className="flex items-center gap-3 mb-3">
                        <CardTopIcon />
                        <h3 style={{ color: PALETTE.primaryBlue, fontSize: 20, fontWeight: 600, margin: 0 }}>
                            Claim
                        </h3>
                    </div>
                    <p style={{ color: PALETTE.body, fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>
                        Centralized hub for managing and reviewing motor insurance claims. Oversee
                        lifecycle from initial submission to final resolution with architectural precision.
                    </p>
                    <div className="flex items-center justify-between">
                        <PrimaryButton>View Claims</PrimaryButton>
                        <Badge>12+</Badge>
                    </div>
                </Card>

                {/* Preinspection card */}
                <Card>
                    <div className="flex items-center gap-3 mb-3">
                        <CardTopIcon />
                        <h3 style={{ color: PALETTE.primaryBlue, fontSize: 20, fontWeight: 600, margin: 0 }}>
                            Preinspection
                        </h3>
                    </div>
                    <p style={{ color: PALETTE.body, fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>
                        Comprehensive management of insurer profiles and specialized policies. Ensure
                        compliance and maintain high-performance standards across the sanctuary ecosystem
                    </p>
                    <div className="flex items-center justify-between">
                        <PrimaryButton>View Claims</PrimaryButton>
                        <Badge>Active Partners</Badge>
                    </div>
                </Card>
            </div>

            {/* ── Bottom row: Performance + Quick Action ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* System Performance Sanctuary */}
                <div style={{ background: '#F3F4F6', border: '1px solid #E3E3E3', padding: 20, borderRadius: 1 }}>
                    <h3 style={{ color: PALETTE.primaryBlue, fontSize: 18, fontWeight: 700, margin: 0 }}>
                        System Performance Sanctuary
                    </h3>
                    <p style={{ color: PALETTE.body, fontSize: 13, fontWeight: 600, marginTop: 6, marginBottom: 18 }}>
                        Real-time telemetry and architectural audit logs.
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-end gap-10">
                            <div>
                                <div style={{ color: PALETTE.primaryBlue, fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
                                    99.9%
                                </div>
                                <div style={{ fontSize: 12, color: PALETTE.body, marginTop: 4 }}>
                                    Up Time
                                </div>
                            </div>
                            <div>
                                <div style={{ color: PALETTE.primaryBlue, fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
                                    24ms
                                </div>
                                <div style={{ fontSize: 12, color: PALETTE.body, marginTop: 4 }}>
                                    Latency
                                </div>
                            </div>
                        </div>
                        <CompassIcon size={56} />
                    </div>
                </div>

                {/* Quick Action */}
                <div style={{ background: '#F3F4F6', border: '1px solid #E3E3E3', padding: 20, borderRadius: 1 }}>
                    <p
                        style={{
                            color: PALETTE.muted,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.18em',
                            margin: 0,
                        }}
                    >
                        QUICK ACTION
                    </p>
                    <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
                        <h3 style={{ color: PALETTE.primaryBlue, fontSize: 22, fontWeight: 700, margin: 0 }}>
                            Generate Report
                        </h3>
                        <ArrowRight />
                    </div>
                    <p style={{ color: PALETTE.body, fontSize: 12, marginTop: 14, fontWeight: 600 }}>
                        Last report generated 2 hours ago by admin
                    </p>
                </div>
            </div>
        </main>
    );
};

export default AdminDashboardPage;
