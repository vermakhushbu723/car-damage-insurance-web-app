import React from 'react';

/**
 * Small circular progress ring used by the AI ILA "Assessment Insights"
 * panel — e.g. AI Confidence 95%, Damage Score 68/100.
 *
 * @param {number} percent      0-100, how much of the ring to fill
 * @param {string} color        ring color
 * @param {string} valueText    text shown in the center (e.g. "95%" or "68/100")
 * @param {string} label        caption below the ring
 */
const DonutGauge = ({ percent, color, valueText, label, size = 88, stroke = 8 }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - Math.min(100, Math.max(0, percent)) / 100);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
                    <circle
                        cx={size / 2} cy={size / 2} r={radius} fill="none"
                        stroke={color} strokeWidth={stroke} strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 800, color: '#111827',
                }}>
                    {valueText}
                </div>
            </div>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, textAlign: 'center' }}>{label}</span>
        </div>
    );
};

export default DonutGauge;
