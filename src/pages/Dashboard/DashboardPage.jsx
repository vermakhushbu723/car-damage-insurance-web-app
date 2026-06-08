import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import AppHeader from '../../components/common/AppHeader';
import ClaimListCard from '../../components/common/ClaimListCard';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { DEMO_CLAIMS } from '../../constants/demoClaims';
import { usePageLoading } from '../../hooks/usePageLoading';
import totalClaimsIcon from '../../assets/icons/TotalClaims.svg';
import surveyCompletedIcon from '../../assets/icons/SurveyCompleted.svg';
import pendingSurveyIcon from '../../assets/icons/PendingSurvey.svg';
import searchClaimIcon from '../../assets/icons/SearchClaim.svg';

const VIEW = {
    TOTAL: 'total',
    COMPLETED: 'completed',
    PENDING: 'pending',
    SEARCH: 'search',
};

const totalCount = DEMO_CLAIMS.length;
const completedCount = DEMO_CLAIMS.filter((c) => c.status === 'Completed').length;
const pendingCount = DEMO_CLAIMS.filter((c) => c.status === 'Pending').length;

const DashboardPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const [view, setView] = useState(VIEW.TOTAL);
    const [query, setQuery] = useState('');

    const statsCards = [
        {
            icon: totalClaimsIcon,
            count: String(totalCount).padStart(2, '0'),
            label: 'Total Claims',
            bg: COLORS.cardTotalClaims,
            border: `1px solid #004FE5`,
            textColor: '#FFFFFF',
            view: VIEW.TOTAL,
        },
        {
            icon: surveyCompletedIcon,
            count: String(completedCount).padStart(2, '0'),
            label: 'Survey Completed',
            bg: COLORS.cardSurveyCompleted,
            border: `1px solid #009348`,
            textColor: '#009348',
            view: VIEW.COMPLETED,
        },
        {
            icon: pendingSurveyIcon,
            count: String(pendingCount).padStart(2, '0'),
            label: 'Pending Survey',
            bg: COLORS.cardPendingSurvey,
            border: `1px solid #FA9D19`,
            textColor: '#fff',
            view: VIEW.PENDING,
        },
        {
            icon: searchClaimIcon,
            count: '',
            label: 'Search Claim',
            bg: COLORS.cardSearchClaim,
            border: `1px solid #5E33E1`,
            textColor: '#FFFFFF',
            view: VIEW.SEARCH,
        },
    ];

    const filteredClaims = useMemo(() => {
        if (view === VIEW.COMPLETED) {
            return DEMO_CLAIMS.filter((c) => c.status === 'Completed');
        }
        if (view === VIEW.PENDING) {
            return DEMO_CLAIMS.filter((c) => c.status === 'Pending');
        }
        if (view === VIEW.SEARCH) {
            const q = query.trim().toLowerCase();
            if (!q) return DEMO_CLAIMS;
            return DEMO_CLAIMS.filter((c) =>
                [c.claimNumber, c.registrationNumber, c.insuredName, c.vehicle, c.location, c.insurerName]
                    .filter(Boolean)
                    .some((f) => f.toLowerCase().includes(q))
            );
        }
        return DEMO_CLAIMS;
    }, [view, query]);

    const listConfig = {
        [VIEW.TOTAL]: { title: 'All Claims', badgeBg: COLORS.primary },
        [VIEW.COMPLETED]: { title: 'Completed Surveys', badgeBg: COLORS.statusCompleted },
        [VIEW.PENDING]: { title: 'Pending Surveys', badgeBg: COLORS.statusPending },
        [VIEW.SEARCH]: { title: query ? `${filteredClaims.length} result${filteredClaims.length !== 1 ? 's' : ''} found` : 'All Claims', badgeBg: COLORS.iconClaim },
    }[view];

    const handleCardClick = (cardView) => {
        setView(cardView);
        if (cardView !== VIEW.SEARCH) setQuery('');
    };

    return (
        <div className="min-h-screen flex flex-col" >
            <AppHeader />

            <div className="" style={{ background: COLORS.bgApp }}>
                <div className="px-4 pt-2 pb-2">
                    <p className="text-base font-semibold" style={{ color: '#fff' }}>
                        Welcome{' '}
                        <span className="underline font-bold" style={{ color: '#fff' }}>
                            XYZ Automobiles
                        </span>
                    </p>
                </div>

                <div className="login-card" style={{ background: '#FFFFFF' }}>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {statsCards.map((card, i) => {
                            const isActive = view === card.view;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleCardClick(card.view)}
                                    className="rounded-2xl px-4 py-4 flex items-center gap-3 text-left active:scale-95 transition-transform"
                                    style={{
                                        background: card.bg,
                                        border: card.border,
                                        boxShadow: isActive ? '0 0 0 2px #00A0FE' : 'none',
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-sm flex items-center justify-center shrink-0"
                                        style={{ background: 'rgba(255,255,255,0.25)', border: `1px solid ${card.textColor}` }}
                                    >
                                        <img className='w-4 h-4' src={card.icon} alt={card.label} />
                                    </div>
                                    <div>
                                        {card.count && (
                                            <p className="text-2xl font-bold leading-tight" style={{ color: card.textColor }}>
                                                {card.count}
                                            </p>
                                        )}
                                        <p className="text-sm font-medium leading-tight" style={{ color: card.textColor }}>
                                            {card.label}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {view === VIEW.SEARCH && (
                        <div className="pb-2">
                            <div
                                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.borderInput}` }}
                            >
                                <SearchOutlined style={{ color: COLORS.textSecondary, fontSize: 16 }} />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search claim number, reg. no., name…"
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    style={{ color: COLORS.textPrimary }}
                                />
                                {query && (
                                    <button onClick={() => setQuery('')}>
                                        <CloseCircleFilled style={{ color: COLORS.textSecondary, fontSize: 16 }} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="pt-2 pb-2 flex items-center justify-between">
                        <p className="text-base font-bold" style={{ color: COLORS.textPrimary }}>
                            {listConfig.title}
                        </p>
                        <span
                            className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                            style={{ background: listConfig.badgeBg }}
                        >
                            {filteredClaims.length}
                        </span>
                    </div>

                    <div className="flex-1 pb-6">
                        {filteredClaims.length === 0 ? (
                            <div
                                className="text-center py-10 rounded-lg"
                                style={{ background: COLORS.bgCard, color: COLORS.textSecondary }}
                            >
                                <p className="text-sm font-medium">No claims match your search.</p>
                            </div>
                        ) : (
                            filteredClaims.map((claim) => (
                                <ClaimListCard
                                    key={claim.id}
                                    claim={claim}
                                    onViewDetails={() => navigate(ROUTES.CLAIM_START)}
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;
