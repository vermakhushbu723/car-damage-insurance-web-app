import React, { useMemo, useState } from 'react';
import { SearchIcon, DocIcon } from '../components/AdminIcons';
import { PALETTE } from '../adminTheme';

const summaryCards = [
    {
        title: 'Total Claims',
        value: '1,248',
        note: '+12% From Last Month',
        noteColor: '#2563EB',
        iconBg: '#DBEAFE',
        iconBorder: '#93C5FD',
        iconColor: '#1D4ED8',
    },
    {
        title: 'Approved Claims',
        value: '856',
        note: '68.5% Approval Rate',
        noteColor: '#2563EB',
        iconBg: '#DBEAFE',
        iconBorder: '#93C5FD',
        iconColor: '#1D4ED8',
    },
    {
        title: 'Pending Claims',
        value: '192',
        note: 'Average 2.4 Days Delay',
        noteColor: '#DC2626',
        iconBg: '#FEE2E2',
        iconBorder: '#FCA5A5',
        iconColor: '#DC2626',
    },
];

const distribution = [
    { label: 'Collision (52%)', value: 624, color: '#123DB7' },
    { label: 'Theft (28%)', value: 336, color: '#8AA9FF' },
    { label: 'Natural Dis. (20%)', value: 240, color: '#F8B9BE' },
];

const claims = [
    { id: '#CL-9082', customerName: 'Customer Name', insurerName: 'Comprehensive', amount: '$4,250.00', status: 'Approved', date: 'Oct 24th 2023' },
    { id: '#CL-9082', customerName: 'Customer Name', insurerName: 'Comprehensive', amount: '$4,250.00', status: 'Pending', date: 'Oct 24th 2023' },
    { id: '#CL-9082', customerName: 'Customer Name', insurerName: 'Comprehensive', amount: '$4,250.00', status: 'Approved', date: 'Oct 24th 2023' },
    { id: '#CL-9082', customerName: 'Customer Name', insurerName: 'Comprehensive', amount: '$4,250.00', status: 'Rejected', date: 'Oct 24th 2023' },
    { id: '#CL-9082', customerName: 'Customer Name', insurerName: 'Comprehensive', amount: '$4,250.00', status: 'Approved', date: 'Oct 24th 2023' },
    { id: '#CL-9082', customerName: 'Customer Name', insurerName: 'Comprehensive', amount: '$4,250.00', status: 'Approved', date: 'Oct 24th 2023' },
];

const pageCardStyle = {
    background: '#FFFFFF',
    border: `1px solid ${PALETTE.borderLight}`,
    borderRadius: 6,
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
};

const SummaryIcon = ({ background, border, color, type = 'doc' }) => (
    <div
        style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            background,
            border: `1px solid ${border}`,
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}
    >
        {type === 'alert' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
        ) : (
            <DocIcon size={12} color={color} />
        )}
    </div>
);

const MetricCard = ({ title, value, note, noteColor, iconBg, iconBorder, iconColor }) => (
    <div style={{ ...pageCardStyle, padding: '14px 12px' }}>
        <div className="flex items-start justify-between gap-3">
            <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#1F2937' }}>{title}</p>
                <h3 style={{ margin: '5px 0 8px', fontSize: 16, lineHeight: 1.1, fontWeight: 800, color: '#111827' }}>{value}</h3>
                <div className="flex items-center gap-1" style={{ color: noteColor, fontSize: 10, fontWeight: 500 }}>
                    <span style={{ fontSize: 10 }}>◉</span>
                    <span>{note}</span>
                </div>
            </div>
            <SummaryIcon
                background={iconBg}
                border={iconBorder}
                color={iconColor}
                type={title === 'Pending Claims' ? 'alert' : 'doc'}
            />
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        Approved: { background: '#DBEAFE', border: '#93C5FD', color: '#1D4ED8' },
        Pending: { background: '#EEF2FF', border: '#E0E7FF', color: '#C7D2FE' },
        Rejected: { background: '#FEE2E2', border: '#FCA5A5', color: '#DC2626' },
    };
    const current = styles[status] || styles.Pending;

    return (
        <span
            style={{
                minWidth: 60,
                display: 'inline-flex',
                justifyContent: 'center',
                padding: '4px 10px',
                fontSize: 10,
                fontWeight: 600,
                borderRadius: 4,
                border: `1px solid ${current.border}`,
                background: current.background,
                color: current.color,
            }}
        >
            {status}
        </span>
    );
};

const AdminClaimPage = () => {
    const [search, setSearch] = useState('');

    const filteredClaims = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return claims;

        return claims.filter((claim) => [claim.id, claim.customerName, claim.insurerName, claim.status]
            .some((field) => field.toLowerCase().includes(query)));
    }, [search]);

    return (
        <main className="admin-page">
            <h1 style={{ margin: '0 0 18px', color: PALETTE.primaryBlue, fontSize: 28, fontWeight: 800 }}>Claim</h1>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-3 mb-3">
                {summaryCards.map((card) => (
                    <MetricCard key={card.title} {...card} />
                ))}
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-[1.12fr_1fr] gap-4 mb-3">
                <div style={{ ...pageCardStyle, padding: 12 }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1F2937' }}>Claims by status</h2>
                        <button
                            aria-label="More options"
                            style={{ border: 'none', background: 'transparent', fontSize: 22, lineHeight: 1, cursor: 'pointer', color: '#111827' }}
                        >
                            ⋮
                        </button>
                    </div>

                    <div style={{ width: '100%', height: 18, borderRadius: 4, overflow: 'hidden', display: 'grid', gridTemplateColumns: '68fr 10fr 22fr', marginBottom: 14 }}>
                        <div style={{ background: '#3558E9' }} />
                        <div style={{ background: '#FDB63E' }} />
                        <div style={{ background: '#FF7E7E' }} />
                    </div>

                    <div className="flex flex-wrap gap-5" style={{ marginBottom: 18 }}>
                        <div>
                            <div className="flex items-center gap-2" style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>
                                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#3558E9', display: 'inline-block' }} />
                                <span>Approved</span>
                            </div>
                            <div style={{ marginTop: 4, fontSize: 10, color: '#111827' }}>68% (856)</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2" style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>
                                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF7E7E', display: 'inline-block' }} />
                                <span>Rejected</span>
                            </div>
                            <div style={{ marginTop: 4, fontSize: 10, color: '#111827' }}>22% (276)</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2" style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>
                                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FDB63E', display: 'inline-block' }} />
                                <span>Pending</span>
                            </div>
                            <div style={{ marginTop: 4, fontSize: 10, color: '#111827' }}>10% (116)</div>
                        </div>
                    </div>

                    <div style={{ background: '#D9E7FF', border: '1px solid #6F9DFF', borderRadius: 4, padding: '12px 18px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>68% of claims have been approved</div>
                        <div style={{ fontSize: 10, color: '#374151', marginTop: 2 }}>Great Job! Your approval rate is above target</div>
                    </div>
                </div>

                <div style={{ ...pageCardStyle, padding: 12 }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1F2937' }}>Claims Distribution</h2>
                        <select
                            defaultValue="Monthly"
                            style={{ border: `1px solid ${PALETTE.borderLight}`, borderRadius: 4, fontSize: 11, padding: '5px 8px', background: '#fff', outline: 'none' }}
                        >
                            <option>Monthly</option>
                            <option>Quarterly</option>
                            <option>Yearly</option>
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                        <div
                            style={{
                                width: 148,
                                height: 148,
                                borderRadius: '50%',
                                background: 'conic-gradient(#123DB7 0deg 187.2deg, #8AA9FF 187.2deg 288deg, #F8B9BE 288deg 360deg)',
                                display: 'grid',
                                placeItems: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <div style={{ width: 102, height: 102, borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ color: '#111827', fontSize: 17, fontWeight: 800, lineHeight: 1 }}>1.2k</div>
                                <div style={{ color: '#6B7280', fontSize: 11, lineHeight: 1.1, marginTop: 4 }}>TOTAL</div>
                            </div>
                        </div>

                        <div style={{ width: '100%', maxWidth: 180 }}>
                            {distribution.map((item) => (
                                <div key={item.label} className="flex items-start gap-3" style={{ marginBottom: 16 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, marginTop: 5, flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>{item.label}</div>
                                        <div style={{ fontSize: 12, color: '#111827', marginTop: 3 }}>{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ ...pageCardStyle, overflow: 'hidden' }}>
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4" style={{ padding: '14px 20px 10px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111827' }}>All Claims</h2>
                        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#111827', fontWeight: 600 }}>Detailed Log &amp; Recent Insurance Activities</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 xl:items-center">
                        <div style={{ position: 'relative', minWidth: 210 }}>
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search Claims"
                                style={{ width: '100%', padding: '11px 36px 11px 14px', borderRadius: 4, border: `1px solid ${PALETTE.borderLight}`, fontSize: 12, outline: 'none', background: '#F8FAFC' }}
                            />
                            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                                <SearchIcon size={14} color="#9CA3AF" />
                            </span>
                        </div>

                        <button
                            style={{ padding: '10px 22px', background: PALETTE.primaryBlue, color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                            Filter  ≡
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
                        <thead>
                            <tr style={{ background: '#F3F4F6', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
                                {['Claim ID', 'Customer Name', 'Insurer Name', 'Amount', 'Status', 'Date', 'Action'].map((heading) => (
                                    <th key={heading} style={{ textAlign: 'left', padding: '11px 18px', fontSize: 11, fontWeight: 700, color: '#111827' }}>{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClaims.map((claim, index) => (
                                <tr key={`${claim.id}-${index}`} style={{ borderBottom: index === filteredClaims.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '18px 18px', fontSize: 11, fontWeight: 700, color: '#111827' }}>{claim.id}</td>
                                    <td style={{ padding: '18px 18px', fontSize: 11, fontWeight: 600, color: '#111827' }}>{claim.customerName}</td>
                                    <td style={{ padding: '18px 18px', fontSize: 11, fontWeight: 600, color: '#111827' }}>{claim.insurerName}</td>
                                    <td style={{ padding: '18px 18px', fontSize: 11, fontWeight: 600, color: '#111827' }}>{claim.amount}</td>
                                    <td style={{ padding: '18px 18px' }}><StatusBadge status={claim.status} /></td>
                                    <td style={{ padding: '18px 18px', fontSize: 11, fontWeight: 600, color: '#111827' }}>{claim.date}</td>
                                    <td style={{ padding: '18px 18px' }}>
                                        <button style={{ padding: '7px 14px', background: '#F3F4F6', color: '#111827', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
};

export default AdminClaimPage;