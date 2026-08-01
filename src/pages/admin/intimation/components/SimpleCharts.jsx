import React from 'react';
import { PALETTE } from '../../adminTheme';

// Small hand-rolled SVG charts for the Claim Details dashboard — no
// charting library dependency, consistent with how DamageBoxOverlay /
// DonutGauge already draw plain SVG elsewhere in this app.

const CHART_H = 260;
const CHART_W = 780;
const PAD_L = 40;
const PAD_T = 14;
const PAD_B = 24;

export const FunnelBarChart = ({ data, highlightIndex, maxValue = 3500 }) => {
    const plotW = CHART_W - PAD_L;
    const plotH = CHART_H - PAD_B;
    const barW = plotW / data.length * 0.5;
    const gap = plotW / data.length;
    const yTicks = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500];

    return (
        <svg viewBox={`0 -${PAD_T} ${CHART_W} ${CHART_H + 24 + PAD_T}`} style={{ width: '100%', height: 'auto' }}>
            {yTicks.map((t) => {
                const y = plotH - (t / maxValue) * plotH;
                return (
                    <g key={t}>
                        <line x1={PAD_L} y1={y} x2={CHART_W} y2={y} stroke="#EEF1F6" strokeWidth="1" />
                        <text x={PAD_L - 8} y={y + 4} textAnchor="end" fontSize="10" fill={PALETTE.muted}>{t}</text>
                    </g>
                );
            })}
            {data.map((d, i) => {
                const x = PAD_L + i * gap + (gap - barW) / 2;
                const h = (d.value / maxValue) * plotH;
                const y = plotH - h;
                return (
                    <g key={d.label}>
                        <rect x={x} y={y} width={barW} height={h} rx={2} fill={i === highlightIndex ? '#EF4444' : PALETTE.primaryBlue} />
                        <text x={x + barW / 2} y={plotH + 16} textAnchor="middle" fontSize="10" fontWeight="700" fill={PALETTE.body}>{d.label}</text>
                    </g>
                );
            })}
        </svg>
    );
};

export const TrendLineChart = ({ series, labels, maxValue = 30000 }) => {
    const plotW = CHART_W - PAD_L;
    const plotH = CHART_H - PAD_B;
    const stepX = plotW / (labels.length - 1);
    const yTicks = [0, 5000, 10000, 15000, 20000, 25000, 30000];
    const yFor = (v) => plotH - (v / maxValue) * plotH;

    return (
        <svg viewBox={`0 -${PAD_T} ${CHART_W} ${CHART_H + 24 + PAD_T}`} style={{ width: '100%', height: 'auto' }}>
            {yTicks.map((t) => {
                const y = yFor(t);
                return (
                    <g key={t}>
                        <line x1={PAD_L} y1={y} x2={CHART_W} y2={y} stroke="#EEF1F6" strokeWidth="1" />
                        <text x={PAD_L - 8} y={y + 4} textAnchor="end" fontSize="10" fill={PALETTE.muted}>
                            {t >= 1000 ? `${t / 1000}k` : t}
                        </text>
                    </g>
                );
            })}
            {series.map((s) => {
                const defined = s.values
                    .map((v, i) => (v == null ? null : { v, i }))
                    .filter(Boolean);
                const points = defined.map(({ v, i }) => `${PAD_L + i * stepX},${yFor(v)}`).join(' ');
                return (
                    <g key={s.name}>
                        {s.dashed ? (
                            defined.map(({ v, i }) => (
                                <circle key={i} cx={PAD_L + i * stepX} cy={yFor(v)} r={3} fill={s.color} />
                            ))
                        ) : (
                            <>
                                <polyline points={points} fill="none" stroke={s.color} strokeWidth="2.5" />
                                {defined.map(({ v, i }) => (
                                    <circle key={i} cx={PAD_L + i * stepX} cy={yFor(v)} r={3.5} fill={s.color} />
                                ))}
                            </>
                        )}
                    </g>
                );
            })}
            {labels.map((l, i) => (
                <text key={l} x={PAD_L + i * stepX} y={plotH + 16} textAnchor="middle" fontSize="10" fill={PALETTE.body}>{l}</text>
            ))}
        </svg>
    );
};

export const HorizontalBarList = ({ items, maxValue }) => {
    const max = maxValue ?? Math.max(...items.map((i) => i.value));
    return (
        <div>
            {items.map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{ width: 110, fontSize: 12, fontWeight: 700, color: PALETTE.body, flexShrink: 0 }}>{item.label}</span>
                    <div style={{ flex: 1, background: '#F1F5F9', borderRadius: 4, height: 12, position: 'relative' }}>
                        <div style={{
                            width: `${(item.value / max) * 100}%`, height: '100%', borderRadius: 4,
                            background: item.muted ? '#D1D5DB' : PALETTE.primaryBlue,
                        }} />
                    </div>
                    <span style={{ width: 36, fontSize: 12, fontWeight: 700, color: PALETTE.body, textAlign: 'right', flexShrink: 0 }}>{item.value}%</span>
                </div>
            ))}
        </div>
    );
};
