import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PALETTE } from '../../adminTheme';
import DocumentManagementPanel from '../components/DocumentManagementPanel';
import { FunnelBarChart, TrendLineChart, HorizontalBarList } from '../components/SimpleCharts';
import { SelectField } from '../components/FormFields';
import { ROUTES } from '../../../../constants/routes';

const STAT_CARDS = [
    { label: 'Total Claims', value: '18,240' },
    { label: 'Approved', value: '14,120' },
    { label: 'Repudiated', value: '1,640' },
    { label: 'Fraud Triggers', value: '820' },
    { label: 'Avg TAT', value: '6.2 Days' },
];

const FUNNEL_DATA = [
    { label: 'Intimation', value: 500 },
    { label: 'Surveyor Alloc', value: 1000 },
    { label: 'Handler', value: 1500 },
    { label: 'AI ILA', value: 2000 },
    { label: 'Handler ILA', value: 2000 },
    { label: 'FLA', value: 1500 },
    { label: 'Recommend', value: 1000 },
    { label: 'Fee Bill', value: 500 },
];

const TREND_LABELS = ['Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026'];
const TREND_SERIES = [
    { name: 'Intimated', color: '#3B82F6', values: [0, 8300, 7000, 15500, 18500, 23200, null, null] },
    { name: 'Approved', color: '#10B981', values: [0, 4000, 2800, 11000, 14300, 19200, null, null] },
    { name: 'Repudiated', color: '#EF4444', dashed: true, values: [800, 800, 800, 800, 800, 800, 800, 800] },
    { name: 'Fraud', color: '#F59E0B', dashed: true, values: [300, 300, 300, 300, 300, 300, 300, 300] },
];

const KEY_RATIOS = Array(7).fill({ label: 'Approve Rate', value: '77.4%', vsLabel: 'Vs Apr 2025', vsValue: '4.8%' });

const REPUDIATION_REASONS = [
    { label: 'Policy Exclusion', value: 28 },
    { label: 'Non Disclosure', value: 22 },
    { label: 'Late Notification', value: 16 },
    { label: 'Insufficient Docs', value: 14 },
    { label: 'Pre-Existing Cond', value: 12, muted: true },
];

const FILTER_OPTIONS = {
    zone: ['North', 'South', 'East', 'West'],
    month: ['January', 'February', 'March', 'April', 'May', 'June'],
    productLine: ['Private Car', 'Two-Wheeler', 'Commercial Vehicle'],
    claimType: ['Own Damage', 'Third Party', 'Total Loss'],
};

const FilterIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

const StatCard = ({ label, value }) => (
    <div style={{ flex: 1, background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: '16px 18px' }}>
        <p style={{ margin: 0, fontSize: 12, color: PALETTE.muted, fontWeight: 600 }}>{label}</p>
        <p style={{ margin: '6px 0 4px', fontSize: 24, fontWeight: 800, color: PALETTE.body }}>{value}</p>
        <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>Vs Apr 2025</p>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div style={{ background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: 20, marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: PALETTE.body }}>{title}</h2>
        {children}
    </div>
);

/**
 * Claims analytics dashboard — a separate page from ClaimDetailsPage.jsx
 * (the per-claim record form). Both were shown as "Claim Details" in the
 * Figma file; this one lives at its own URL, linked from the record page,
 * since the sidebar's "Claim Details" item opens the record form directly.
 */
const ClaimAnalyticsPage = () => {
    const navigate = useNavigate();
    const [zone, setZone] = useState('');
    const [month, setMonth] = useState('');
    const [productLine, setProductLine] = useState('');
    const [claimType, setClaimType] = useState('');

    return (
        <main style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: PALETTE.primaryBlue }}>Claim Details</h1>
                <button
                    onClick={() => navigate(ROUTES.INTIMATION.CLAIM_DETAILS)}
                    style={{ padding: '9px 20px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: `1px solid ${PALETTE.cardBorder}`, background: '#fff', color: PALETTE.muted }}
                >
                    ← Back To Claim Record
                </button>
            </div>

            <div className="im-page-flex">
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="im-grid-auto" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 16 }}>
                        <SelectField value={zone} onChange={setZone} options={FILTER_OPTIONS.zone} placeholder="Zone" />
                        <SelectField value={month} onChange={setMonth} options={FILTER_OPTIONS.month} placeholder="Month" />
                        <SelectField value={productLine} onChange={setProductLine} options={FILTER_OPTIONS.productLine} placeholder="Product Line" />
                        <SelectField value={claimType} onChange={setClaimType} options={FILTER_OPTIONS.claimType} placeholder="Claim Type" />
                        <button style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            padding: '10px 12px', borderRadius: 6, border: `1px solid ${PALETTE.cardBorder}`, background: '#fff',
                            fontSize: 13, fontWeight: 700, color: PALETTE.muted, cursor: 'pointer',
                        }}>
                            <FilterIcon /> Filters
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
                        {STAT_CARDS.map((s) => <StatCard key={s.label} {...s} />)}
                    </div>

                    <ChartCard title="Claims Funnel - Pendency By Stage">
                        <FunnelBarChart data={FUNNEL_DATA} highlightIndex={3} />
                    </ChartCard>

                    <ChartCard title="Month - On - Month Trend (Last 6 Month)">
                        <TrendLineChart series={TREND_SERIES} labels={TREND_LABELS} />
                    </ChartCard>

                    <div className="im-form-grid">
                        <div style={{ background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: 20 }}>
                            <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 800, color: PALETTE.body }}>Key Ratios</h2>
                            {KEY_RATIOS.map((r, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < KEY_RATIOS.length - 1 ? `1px solid ${PALETTE.borderLight}` : 'none' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: PALETTE.body }}>{r.label}</p>
                                        <p style={{ margin: '2px 0 0', fontSize: 11, color: PALETTE.muted }}>{r.value}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: 11, color: PALETTE.muted }}>{r.vsLabel}</p>
                                        <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: PALETTE.body }}>{r.vsValue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: 20 }}>
                            <h2 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 800, color: PALETTE.body }}>Top 5 Reasons For Repudiation</h2>
                            <HorizontalBarList items={REPUDIATION_REASONS} maxValue={28} />
                        </div>
                    </div>
                </div>

                <DocumentManagementPanel stageName="Claim Details" />
            </div>
        </main>
    );
};

export default ClaimAnalyticsPage;
