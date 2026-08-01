import React from 'react';
import FilterBar from '../components/FilterBar';

const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const rows = Array(8).fill({
    flaDetails: 'CLM001',
    settlementType: 'Partial Loss',
    recDate: '11/01/2022',
    closureType: 'Payment',
    invoiceNumber: 'W0309G202200416',
    invoiceAmount: '₹45817',
    status: 'CLM001',
});

const RecommendationPage = () => (
    <main style={{ padding: '20px 24px', fontFamily: 'Instrument Sans, sans-serif' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1454D1' }}>Recommendation</h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>Manage Loss Approvals and First Loss Assessments</p>
            </div>
            <button style={{ background: '#1454D1', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                + Add Recommendation
            </button>
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'auto', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 860 }}>
                <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                        {['FLA Details', 'Settlement Type', 'Recommendation Date', 'Closure Type', 'Invoice Number', 'Invoice Amount', 'Status', 'Action'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: 12, borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#111827' }}>{row.flaDetails}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.settlementType}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.recDate}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.closureType}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.invoiceNumber}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.invoiceAmount}</td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.status}</td>
                            <td style={{ padding: '14px 16px' }}>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><EyeIcon /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </main>
);

export default RecommendationPage;
