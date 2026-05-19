import React from 'react';

const SPARK_PATHS = {
    blue: 'M0,28 C20,22 35,30 55,24 C75,18 90,26 110,20 C130,14 145,22 160,16',
    orange: 'M0,22 C20,28 35,20 55,26 C75,32 90,22 110,28 C130,24 145,30 160,24',
    green: 'M0,26 C25,20 40,28 65,22 C85,16 100,24 120,18 C140,22 155,16 160,20',
    purple: 'M0,24 C20,30 35,22 55,28 C75,24 90,32 110,26 C130,20 145,28 160,22',
};
const SPARK_COLORS = {
    blue: '#3B82F6', orange: '#F59E0B', green: '#10B981', purple: '#8B5CF6',
};

const Sparkline = ({ variant }) => (
    <svg viewBox="0 0 160 40" width="100%" height="36" preserveAspectRatio="none" style={{ display: 'block', marginTop: 10 }}>
        <path d={SPARK_PATHS[variant]} fill="none" stroke={SPARK_COLORS[variant]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * @param {string}  title
 * @param {string}  value
 * @param {string}  iconBg         – background colour of the circle
 * @param {string}  iconBorderColor
 * @param {ReactNode} icon         – SVG element
 * @param {'blue'|'orange'|'green'|'purple'} sparkVariant
 * @param {boolean} showBadge      – show "↑ xx% vs Last Month" badge
 * @param {string}  percentText    – e.g. "18.6%"
 */
const MetricCard = ({
    title, value, iconBg, iconBorderColor, icon,
    sparkVariant = 'blue', showBadge = false, percentText = '18.6%',
}) => (
    <div style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        padding: '16px 20px',
        flex: 1,
        minWidth: 0,
        boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
                width: 46, height: 46, borderRadius: '50%',
                background: iconBg,
                border: `2px solid ${iconBorderColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: 12, color: '#6B7280', margin: 0, fontWeight: 500 }}>{title}</p>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: '3px 0 0', lineHeight: 1 }}>{value}</h3>
            </div>
        </div>

        <Sparkline variant={sparkVariant} />

        {showBadge && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <span style={{
                    background: '#EFF6FF', color: '#3B82F6',
                    fontSize: 11, fontWeight: 700,
                    padding: '3px 8px', borderRadius: 20,
                    display: 'inline-flex', alignItems: 'center', gap: 2,
                }}>
                    ↑ {percentText}
                </span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>vs Last Month</span>
            </div>
        )}
    </div>
);

export default MetricCard;
