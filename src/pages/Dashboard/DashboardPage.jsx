import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/common/AppHeader';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { usePageLoading } from '../../hooks/usePageLoading';
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
import totalClaimsIcon from '../../assets/icons/TotalClaims.svg';
import surveyCompletedIcon from '../../assets/icons/SurveyCompleted.svg';
import pendingSurveyIcon from '../../assets/icons/PendingSurvey.svg';
import searchClaimIcon from '../../assets/icons/SearchClaim.svg';
import insurerNameIcon from '../../assets/icons/insurerName.svg';
import claimNumberIcon from '../../assets/icons/claimNumber.svg';
import registrationNumberIcon from '../../assets/icons/registrationNumber.svg';
import insuredNameIcon from '../../assets/icons/insuredName.svg';

const statsCards = [
    {
        icon: totalClaimsIcon,
        count: '20',
        label: 'Total Claims',
        bg: COLORS.cardTotalClaims,
        border: `1px solid #004FE5`,
        textColor: '#FFFFFF',
        route: ROUTES.TOTAL_CLAIMS,
    },
    {
        icon: surveyCompletedIcon,
        count: '12',
        label: 'Survey Completed',
        bg: COLORS.cardSurveyCompleted,
        border: `1px solid #009348`,
        textColor: '#009348',
        route: ROUTES.SURVEY_COMPLETED,
    },
    {
        icon: pendingSurveyIcon,
        count: '08',
        label: 'Pending Survey',
        bg: COLORS.cardPendingSurvey,
        border: `1px solid #FA9D19`,
        textColor: '#fff',
        route: ROUTES.PENDING_SURVEY,
    },
    {
        icon: searchClaimIcon,
        count: '03',
        label: 'Search Claim',
        bg: COLORS.cardSearchClaim,
        border: `1px solid #5E33E1`,
        textColor: '#FFFFFF',
        route: ROUTES.SEARCH_CLAIM,
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
        className="mb-4 rounded-lg px-5 py-4"
        style={{ background: '#DAF0FE' }}
    >
        {/* Status Badge */}
        <div className="flex justify-end mb-3 ">
            <span
                className="px-4 py-1 rounded-lg text-xs font-semibold"
                style={{
                    background: '#F0000040',
                    color: COLORS.statusPending,
                    border: `1px solid ${COLORS.statusPending}`,
                }}
            >
                {claim.status}
            </span>
        </div>

        {/* Fields */}
        {[
            { icon: insurerNameIcon, label: 'Insurer Name', value: claim.insurerName },
            { icon: claimNumberIcon, label: 'Claim Number', value: claim.claimNumber },
            { icon: registrationNumberIcon, label: 'Registration Number', value: claim.registrationNumber },
            { icon: insuredNameIcon, label: 'Insured Name', value: claim.insuredName },
        ].map((row, i) => (
            <div key={i} className="flex items-center gap-3 mb-2 ">
                <span className="w-6 flex justify-center"><img src={row.icon} alt={row.label} className="src" /></span>
                <span className="text-sm w-36 font-semibold" style={{ color: COLORS.textSecondary }}>{row.label}</span>
                <span className="text-sm font-semibold flex-1" style={{ color: COLORS.textPrimary }}>{row.value}</span>
            </div>
        ))}

        {/* Divider */}
        <div className="my-3" style={{ borderTop: '1px solid #00000033' }} />

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
    usePageLoading();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col" >
            {/* Header */}
            <AppHeader />

            <div class="" style={{ background: COLORS.bgApp }}>
                {/* Welcome Text */}
                <div className="px-4 pt-2 pb-2">
                    <p className="text-base font-semibold" style={{ color: '#fff' }}>
                        Welcome{' '}
                        <span className="underline font-bold" style={{ color: '#fff' }}>
                            XYZ Automobiles
                        </span>
                    </p>
                </div>

                <div class="login-card" style={{ background: '#FFFFFF' }}>

                    {/* Stats Cards Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {statsCards.map((card, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => navigate(card.route)}
                                className="rounded-2xl px-4 py-4 flex items-center gap-3 text-left active:scale-95 transition-transform"
                                style={{ background: card.bg, border: card.border }}
                            >
                                <div
                                    className="w-12 h-12 rounded-sm flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(255,255,255,0.25)', border: `1px solid ${card.textColor}` }}
                                >
                                    <img className='w-4 h-4' src={card.icon} alt={card.label} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold leading-tight" style={{ color: card.textColor }}>
                                        {card.count}
                                    </p>
                                    <p className="text-xs font-medium leading-tight" style={{ color: card.textColor }}>
                                        {card.label}
                                    </p>
                                </div>
                            </button>
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

            </div>
        </div>
    );
};

export default DashboardPage;
