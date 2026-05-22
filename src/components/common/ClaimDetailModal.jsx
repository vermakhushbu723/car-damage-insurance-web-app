import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { COLORS } from '../../constants/theme';

/**
 * Bottom-sheet style modal showing full claim details.
 * Used by the Dashboard list pages.
 */
const ClaimDetailModal = ({ claim, onClose }) => {
    if (!claim) return null;

    const isCompleted = claim.status === 'Completed';
    const badgeColor = isCompleted ? COLORS.statusCompleted : COLORS.statusPending;
    const badgeBg = isCompleted ? '#22C55E26' : '#F0000040';

    const rows = [
        { label: 'Insurer Name', value: claim.insurerName },
        { label: 'Claim Number', value: claim.claimNumber },
        { label: 'Registration No.', value: claim.registrationNumber },
        { label: 'Insured Name', value: claim.insuredName },
        { label: 'Vehicle', value: claim.vehicle },
        { label: 'Survey Date', value: claim.surveyDate },
        { label: 'Location', value: claim.location },
        { label: 'Claim Amount', value: claim.amount },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: COLORS.overlay }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-t-2xl bg-white p-5 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
                        Claim Details
                    </h3>
                    <button onClick={onClose} className="text-gray-500">
                        <CloseOutlined style={{ fontSize: 18 }} />
                    </button>
                </div>

                <div className="flex justify-end mb-3">
                    <span
                        className="px-4 py-1 rounded-lg text-xs font-semibold"
                        style={{
                            background: badgeBg,
                            color: badgeColor,
                            border: `1px solid ${badgeColor}`,
                        }}
                    >
                        {claim.status}
                    </span>
                </div>

                <div
                    className="rounded-lg p-4 mb-4"
                    style={{ background: COLORS.bgCard }}
                >
                    {rows.map((row, i) => (
                        <div key={i} className="flex items-start py-2 border-b last:border-0" style={{ borderColor: '#00000020' }}>
                            <span className="text-sm w-36 font-medium" style={{ color: COLORS.textSecondary }}>
                                {row.label}
                            </span>
                            <span className="text-sm flex-1 font-semibold" style={{ color: COLORS.textPrimary }}>
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-lg text-white font-semibold"
                    style={{ background: COLORS.btnPrimary }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ClaimDetailModal;
