import React, { useEffect, useRef, useState } from 'react';

// Cycles through a fixed palette by index so each numbered region gets a
// visually distinct, stable color regardless of damage type — matches the
// reference design's multi-colored numbered boxes.
const BOX_COLORS = ['#EF4444', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16'];

/**
 * Bounding-box-per-detection overlay with a numbered badge + label pill,
 * matching the client reference design's "AI Analysis" viewer. Computes
 * each box from the detection's mask_polygon (min/max x/y) so it works
 * with the same Detection shape the rest of the app already uses.
 */
const DamageBoxOverlay = ({ imageUrl, detections, selectedIndex, onSelect, filters }) => {
    const wrapRef = useRef(null);
    const [size, setSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [imageUrl]);

    const boxesFor = (polygon) => {
        const xs = polygon.map((p) => p[0]);
        const ys = polygon.map((p) => p[1]);
        return {
            x: Math.min(...xs), y: Math.min(...ys),
            w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys),
        };
    };

    const imgFilterCss = [
        filters?.brightness != null ? `brightness(${filters.brightness})` : null,
        filters?.rotateDeg ? null : null, // rotation handled via transform, not filter
    ].filter(Boolean).join(' ') || undefined;

    return (
        <div
            ref={wrapRef}
            style={{
                position: 'relative', width: '100%', background: '#E2E8F0',
                borderRadius: 10, overflow: 'hidden', aspectRatio: '4 / 3',
            }}
        >
            <div
                style={{
                    width: '100%', height: '100%',
                    transform: `scale(${filters?.zoom ?? 1}) rotate(${filters?.rotateDeg ?? 0}deg)`,
                    transition: 'transform 0.2s ease',
                    transformOrigin: 'center center',
                }}
            >
                <img
                    src={imageUrl}
                    alt="AI analysis subject"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', filter: imgFilterCss }}
                    draggable={false}
                />
            </div>
            {size.w > 0 && (
                <svg width={size.w} height={size.h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {detections.map((d, i) => {
                        const box = boxesFor(d.mask_polygon);
                        const color = BOX_COLORS[i % BOX_COLORS.length];
                        const active = i === selectedIndex;
                        const px = box.x * size.w;
                        const py = box.y * size.h;
                        const pw = box.w * size.w;
                        const ph = box.h * size.h;
                        return (
                            <g key={i} style={{ pointerEvents: 'auto', cursor: 'pointer' }} onClick={() => onSelect(i)}>
                                <rect
                                    x={px} y={py} width={pw} height={ph}
                                    fill={active ? `${color}22` : 'transparent'}
                                    stroke={color} strokeWidth={active ? 3 : 2} rx={4}
                                />
                                <circle cx={px} cy={py} r={11} fill={color} stroke="#fff" strokeWidth={2} />
                                <text x={px} y={py + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">
                                    {String(i + 1).padStart(2, '0')}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            )}
            {size.w > 0 && (
                <div style={{ position: 'absolute', inset: 0 }}>
                    {detections.map((d, i) => {
                        const box = boxesFor(d.mask_polygon);
                        const color = BOX_COLORS[i % BOX_COLORS.length];
                        const px = box.x * size.w;
                        const py = box.y * size.h;
                        const ph = box.h * size.h;
                        return (
                            <div
                                key={i}
                                onClick={() => onSelect(i)}
                                style={{
                                    position: 'absolute', left: Math.max(4, px), top: py + ph + 4,
                                    background: color, color: '#fff', fontSize: 10, fontWeight: 700,
                                    padding: '3px 8px', borderRadius: 5, whiteSpace: 'nowrap', cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.35)', lineHeight: 1.4,
                                }}
                            >
                                {d.displayLabel || d.part}
                                {d.displayStatus && (
                                    <div style={{ fontWeight: 500, opacity: 0.9 }}>{d.displayStatus}</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DamageBoxOverlay;
