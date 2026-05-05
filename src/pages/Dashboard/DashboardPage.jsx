import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/common/AppHeader';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import {
    FileTextOutlined,
    CheckSquareOutlined,
    ClockCircleOutlined,
    BankOutlined,
    SafetyOutlined,
    CarOutlined,
    UserOutlined,
    FileOutlined,
    RightOutlined,
} from '@ant-design/icons';

const statsCards = [
    {
        icon: <FileTextOutlined style={{ fontSize: 28, color: '#fff' }} />,
        count: '20',
        label: 'Total Claims',
        bg: COLORS.cardTotalClaims,
        textColor: '#fff',
    },
    {
        icon: <CheckSquareOutlined style={{ fontSize: 28, color: COLORS.textPrimary }} />,
        count: '12',
        label: 'Survey Completed',
        bg: COLORS.cardSurveyCompleted,
        textColor: COLORS.textPrimary,
    },
    {
        icon: <ClockCircleOutlined style={{ fontSize: 28, color: '#fff' }} />,
        count: '08',
        label: 'Pending Survey',
        bg: COLORS.cardPendingSurvey,
        textColor: '#fff',
    },
    {
        icon: <BankOutlined style={{ fontSize: 28, color: '#fff' }} />,
        count: '03',
        label: 'Search Claim',
        bg: COLORS.cardSearchClaim,
        textColor: COLORS.textPrimary,
    },
];

const claimsList = [
    {
        insurerName: 'Name',
        claimNumber: 'CLM1234567890',
        registrationNumber: 'OD 02 AB 1234',
        insuredName: 'User Name',
        status: 'Pending',
    },
    {
        insurerName: 'Name',
        claimNumber: 'CLM1234567890',
        registrationNumber: 'OD 02 AB 1234',
        insuredName: 'User Name',
        status: 'Pending',
    },
    {
        insurerName: 'Name',
        claimNumber: 'CLM1234567890',
        registrationNumber: 'OD 02 AB 1234',
        insuredName: 'User Name',
        status: 'Pending',
    },
];

const ClaimCard = ({ claim, onViewDetails }) => (
    <div
        className="mx-4 mb-4 rounded-2xl px-5 py-4"
        style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
    >
        {/* Status Badge */}
        <div className="flex justify-end mb-3">
            <span
                className="px-4 py-1 rounded-full text-xs font-semibold"
                style={{
                    background: '#FEE2E2',
                    color: COLORS.statusPending,
                    border: `1px solid ${COLORS.statusPending}`,
                }}
            >
                {claim.status}
            </span>
        </div>

        {/* Fields */}
        {[
            { icon: <SafetyOutlined style={{ color: '#22C55E', fontSize: 16 }} />, label: 'Insurer Name', value: claim.insurerName },
            { icon: <FileOutlined style={{ color: '#EA580C', fontSize: 16 }} />, label: 'Claim Number', value: claim.claimNumber },
            { icon: <CarOutlined style={{ color: '#EF4444', fontSize: 16 }} />, label: 'Registration Number', value: claim.registrationNumber },
            { icon: <UserOutlined style={{ color: '#7C3AED', fontSize: 16 }} />, label: 'Insured Name', value: claim.insuredName },
        ].map((row, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
                <span className="w-6 flex justify-center">{row.icon}</span>
                <span className="text-sm w-36" style={{ color: COLORS.textSecondary }}>{row.label}</span>
                <span className="text-sm font-semibold flex-1" style={{ color: COLORS.textPrimary }}>{row.value}</span>
            </div>
        ))}

        {/* Divider */}
        <div className="my-3" style={{ borderTop: '1px solid #E2E8F0' }} />

        {/* View Details */}
        <div className="flex justify-end">
            <button
                onClick={onViewDetails}
                className="flex items-center gap-1 text-sm font-semibold"
                style={{ color: COLORS.primary }}
            >
                View Details <RightOutlined style={{ fontSize: 12 }} />
            </button>
        </div>
    </div>
);

const DashboardPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col" style={{ background: COLORS.bgApp }}>
            {/* Header */}
            <AppHeader />

            {/* Welcome Text */}
            <div className="px-4 pt-4 pb-3">
                <p className="text-base font-semibold" style={{ color: '#fff' }}>
                    Welcome{' '}
                    <span className="underline font-bold" style={{ color: '#fff' }}>
                        XYZ Automobiles
                    </span>
                </p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 gap-3 px-4 mb-4">
                {statsCards.map((card, i) => (
                    <div
                        key={i}
                        className="rounded-2xl px-4 py-4 flex items-center gap-3"
                        style={{ background: card.bg }}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(255,255,255,0.25)' }}
                        >
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-bold leading-tight" style={{ color: card.textColor }}>
                                {card.count}
                            </p>
                            <p className="text-xs font-medium leading-tight" style={{ color: card.textColor }}>
                                {card.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Claims List */}
            <div className="flex-1 pb-6">
                {claimsList.map((claim, i) => (
                    <ClaimCard
                        key={i}
                        claim={claim}
                        onViewDetails={() => navigate(ROUTES.CLAIM_START)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
