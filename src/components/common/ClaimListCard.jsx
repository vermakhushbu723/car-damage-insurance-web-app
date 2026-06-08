import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import { COLORS } from '../../constants/theme';
import insurerNameIcon from '../../assets/icons/insurerName.svg';
import claimNumberIcon from '../../assets/icons/claimNumber.svg';
import registrationNumberIcon from '../../assets/icons/registrationNumber.svg';
import insuredNameIcon from '../../assets/icons/insuredName.svg';

const ClaimListCard = ({ claim, onViewDetails }) => {
    const isCompleted = claim.status === 'Completed';
    const badgeColor = isCompleted ? COLORS.statusCompleted : COLORS.statusPending;
    const badgeBg = isCompleted ? '#22C55E26' : '#F0000040';

    return (
        <div className="mb-3 rounded-lg px-3 py-2" style={{ background: '#DAF0FE' }}>
            {/* Status Badge */}
            <div className="flex justify-end mb-1">
                <span
                    className="px-3 py-0.5 rounded-md text-sm font-semibold"
                    style={{
                        background: badgeBg,
                        color: badgeColor,
                        border: `1px solid ${badgeColor}`,
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
                <div key={i} className="flex items-center gap-2 mb-1">
                    <span className="w-5 flex justify-center"><img src={row.icon} alt={row.label} className="w-4 h-4" /></span>
                    <span className="text-sm w-32 font-semibold" style={{ color: COLORS.textSecondary }}>{row.label}</span>
                    <span className="text-sm font-semibold flex-1" style={{ color: COLORS.textPrimary }}>{row.value}</span>
                </div>
            ))}

            {/* Divider */}
            <div className="my-1.5" style={{ borderTop: '1px solid #00000033' }} />

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
};

export default ClaimListCard;
