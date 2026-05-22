import React, { useState } from 'react';
import AppHeader from '../../components/common/AppHeader';
import PageTitleBar from '../../components/common/PageTitleBar';
import ClaimListCard from '../../components/common/ClaimListCard';
import ClaimDetailModal from '../../components/common/ClaimDetailModal';
import { COLORS } from '../../constants/theme';
import { DEMO_CLAIMS } from '../../constants/demoClaims';
import { usePageLoading } from '../../hooks/usePageLoading';

const TotalClaimsPage = () => {
    usePageLoading();
    const [selected, setSelected] = useState(null);

    return (
        <div className="min-h-screen flex flex-col">
            <AppHeader />
            <PageTitleBar title="Total Claims" subtitle={`${DEMO_CLAIMS.length} claims in total`} />

            <div style={{ background: COLORS.bgApp }} className="flex-1">
                <div className="login-card" style={{ background: '#FFFFFF' }}>
                    <div className="px-2 pt-3 pb-2 flex items-center justify-between">
                        <p className="text-base font-bold" style={{ color: COLORS.textPrimary }}>
                            All Claims
                        </p>
                        <span
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ background: COLORS.primary }}
                        >
                            {DEMO_CLAIMS.length}
                        </span>
                    </div>

                    <div className="px-2 pb-6">
                        {DEMO_CLAIMS.map((claim) => (
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

export default TotalClaimsPage;
