import React, { useState, useMemo } from 'react';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import AppHeader from '../../components/common/AppHeader';
import PageTitleBar from '../../components/common/PageTitleBar';
import ClaimListCard from '../../components/common/ClaimListCard';
import ClaimDetailModal from '../../components/common/ClaimDetailModal';
import { COLORS } from '../../constants/theme';
import { DEMO_CLAIMS } from '../../constants/demoClaims';
import { usePageLoading } from '../../hooks/usePageLoading';

const SearchClaimPage = () => {
    usePageLoading();
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(null);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return DEMO_CLAIMS;
        return DEMO_CLAIMS.filter((c) =>
            [
                c.claimNumber,
                c.registrationNumber,
                c.insuredName,
                c.vehicle,
                c.location,
            ]
                .filter(Boolean)
                .some((f) => f.toLowerCase().includes(q))
        );
    }, [query]);

    return (
        <div className="min-h-screen flex flex-col">
            <AppHeader />
            <PageTitleBar title="Search Claim" subtitle="Find by claim no., reg. no. or name" />

            <div style={{ background: COLORS.bgApp }} className="flex-1">
                <div className="login-card" style={{ background: '#FFFFFF' }}>
                    {/* Search Input */}
                    <div className="px-2 pt-3 pb-2">
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

                    {/* Result count */}
                    <div className="px-2 pt-2 pb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold" style={{ color: COLORS.textSecondary }}>
                            {query ? `${results.length} result${results.length !== 1 ? 's' : ''} found` : 'All Claims'}
                        </p>
                        <span
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ background: COLORS.iconClaim }}
                        >
                            {results.length}
                        </span>
                    </div>

                    {/* Results List */}
                    <div className="px-2 pb-6">
                        {results.length === 0 ? (
                            <div
                                className="text-center py-10 rounded-lg"
                                style={{ background: COLORS.bgCard, color: COLORS.textSecondary }}
                            >
                                <p className="text-sm font-medium">No claims match your search.</p>
                            </div>
                        ) : (
                            results.map((claim) => (
                                <ClaimListCard
                                    key={claim.id}
                                    claim={claim}
                                    onViewDetails={() => setSelected(claim)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <ClaimDetailModal claim={selected} onClose={() => setSelected(null)} />
        </div>
    );
};

export default SearchClaimPage;
