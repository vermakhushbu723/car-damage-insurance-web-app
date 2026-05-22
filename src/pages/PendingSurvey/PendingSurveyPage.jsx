import React, { useState } from 'react';
import AppHeader from '../../components/common/AppHeader';
import PageTitleBar from '../../components/common/PageTitleBar';
import ClaimListCard from '../../components/common/ClaimListCard';
import ClaimDetailModal from '../../components/common/ClaimDetailModal';
import { COLORS } from '../../constants/theme';
import { DEMO_CLAIMS } from '../../constants/demoClaims';
import { usePageLoading } from '../../hooks/usePageLoading';

const PendingSurveyPage = () => {
    usePageLoading();
    const [selected, setSelected] = useState(null);

    const pending = DEMO_CLAIMS.filter((c) => c.status === 'Pending');

    return (
        <div className="min-h-screen flex flex-col">
            <AppHeader />
            <PageTitleBar title="Pending Survey" subtitle={`${pending.length} surveys waiting`} />

            <div style={{ background: COLORS.bgApp }} className="flex-1">
                <div className="login-card" style={{ background: '#FFFFFF' }}>
                    <div className="px-2 pt-3 pb-2 flex items-center justify-between">
                        <p className="text-base font-bold" style={{ color: COLORS.textPrimary }}>
                            Pending Surveys
                        </p>
                        <span
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ background: COLORS.statusPending }}
                        >
                            {pending.length}
                        </span>
                    </div>

                    <div className="px-2 pb-6">
                        {pending.map((claim) => (
                            <ClaimListCard
                                key={claim.id}
                                claim={claim}
                                onViewDetails={() => setSelected(claim)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <ClaimDetailModal claim={selected} onClose={() => setSelected(null)} />
        </div>
    );
};

export default PendingSurveyPage;
