import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import FilterBar from '../components/FilterBar';
import { ROUTES } from '../../../../constants/routes';

const ClipIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);
const ClockIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);
const CheckIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
const BoxIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
);

const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);

const rows = Array(6).fill({
    assessment: 'ASS001',
    type: 'PRELIMINARY',
    date: '2025-12-10',
    policyNo: 'C126410311550',
    name: 'DUSHMANTA KUMAR DHAL',
    lossDate: '2025-12-01',
    surveyorName: 'RASHMI RANJAN ROUT',
    surveyorCode: 'IRDA/NDB/LA/7350/7',
    vehicleName: 'RASHMI RANJAN ROUT',
    vehicleCode: 'IRDA/NDB/LA/7350/7',
    status: 'Completed',
});

const ILAPage = () => {
    const navigate = useNavigate();

    return (
    <main style={{ padding: '20px 24px', fontFamily: 'Instrument Sans, sans-serif' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1454D1' }}>ILA (Initial Loss Assessment)</h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>Manage Insurance Loss Assessments and Survey Reports</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
                <button
                    onClick={() => navigate(ROUTES.INTIMATION.AI_ILA)}
                    style={{ background: '#1454D1', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                    AI ILA
                </button>
                <button style={{ background: '#1454D1', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    + Create New Assessment
                </button>
            </div>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <MetricCard title="Total Claims" value="03" iconBg="#EFF6FF" iconBorderColor="#BFDBFE" icon={<ClipIcon />} sparkVariant="blue" />
            <MetricCard title="In Progress" value="01" iconBg="#FFFBEB" iconBorderColor="#FDE68A" icon={<ClockIcon />} sparkVariant="orange" />
            <MetricCard title="Completed" value="01" iconBg="#ECFDF5" iconBorderColor="#A7F3D0" icon={<CheckIcon />} sparkVariant="green" />
            <MetricCard title="Closed" value="01" iconBg="#F5F3FF" iconBorderColor="#DDD6FE" icon={<BoxIcon />} sparkVariant="purple" />
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                        {['Assessment Details', 'Insured Name', 'Surveyor', 'Vehicle', 'Status', 'Action'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: 12, borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ fontWeight: 700, color: '#111827' }}>{row.assessment}</div>
                                <div style={{ color: '#6B7280', fontSize: 12 }}>{row.type}</div>
                                <div style={{ color: '#6B7280', fontSize: 12 }}>{row.date}</div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ fontWeight: 600, color: '#111827' }}>{row.policyNo}</div>
                                <div style={{ color: '#374151', fontSize: 12 }}>{row.name}</div>
                                <div style={{ color: '#6B7280', fontSize: 12 }}>Loss: {row.lossDate}</div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ fontWeight: 600, color: '#111827' }}>{row.surveyorName}</div>
                                <div style={{ color: '#6B7280', fontSize: 12 }}>{row.surveyorCode}</div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ fontWeight: 600, color: '#111827' }}>{row.vehicleName}</div>
                                <div style={{ color: '#6B7280', fontSize: 12 }}>{row.vehicleCode}</div>
                            </td>
                            <td style={{ padding: '14px 16px', color: '#374151' }}>{row.status}</td>
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', gap: 10, color: '#6B7280' }}>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#6B7280' }}><EyeIcon /></button>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#6B7280' }}><EditIcon /></button>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#6B7280' }}><TrashIcon /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </main>
    );
};

export default ILAPage;
