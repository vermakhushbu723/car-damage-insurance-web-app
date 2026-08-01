import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PALETTE } from '../../adminTheme';

// Reuse the vehicle silhouette images already bundled with the app as
// stand-in "inspection photos" for this demo — swap for real uploaded
// survey photos in production use.
import sampleFront from '../../../../assets/png/car/Front.png';
import sampleFrontLeft from '../../../../assets/png/car/FrontLeft.png';
import sampleRear from '../../../../assets/png/car/Rear.png';
import sampleRight from '../../../../assets/png/car/Right.png';

const SAMPLE_IMAGES = [
    { id: 'sample-front', label: 'Sample: Front', src: sampleFront },
    { id: 'sample-front-left', label: 'Sample: Front Left', src: sampleFrontLeft },
    { id: 'sample-rear', label: 'Sample: Rear', src: sampleRear },
    { id: 'sample-right', label: 'Sample: Right', src: sampleRight },
];

// Matches app/schemas.py's DamageType / part vocabulary in the AI service,
// so exports here line up with what the training pipeline expects.
const DAMAGE_TYPES = ['dent', 'scratch', 'crack', 'shatter', 'deformation', 'tear'];
const PARTS = [
    'front_bumper', 'rear_bumper', 'bonnet', 'front_door_lh', 'front_door_rh',
    'rear_door_lh', 'rear_door_rh', 'fender_lh', 'fender_rh', 'headlamp_lh',
    'headlamp_rh', 'tail_light_lh', 'tail_light_rh', 'windshield_front',
    'windshield_rear', 'roof', 'boot_lid',
];

const DAMAGE_COLORS = {
    dent: '#3B82F6', scratch: '#F59E0B', crack: '#EF4444',
    shatter: '#8B5CF6', deformation: '#EC4899', tear: '#10B981',
};

const cardStyle = {
    background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8,
    padding: 20, marginBottom: 20,
};
const labelStyle = { fontSize: 12, fontWeight: 700, color: PALETTE.muted, marginBottom: 4, display: 'block' };
const inputStyle = { width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${PALETTE.cardBorder}`, fontSize: 13 };
const btn = (bg, color = '#fff') => ({
    background: bg, color, border: 'none', borderRadius: 6, padding: '8px 16px',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
});

let nextPolygonId = 1;

function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Converts one image's polygon annotations to YOLO11 segmentation label
 * format — one line per instance: `<class_id> x1 y1 x2 y2 ... xn yn`,
 * coordinates normalized 0-1. This is exactly the .txt format
 * `yolo segment train` consumes (see ai-damage-assessment-service/training).
 */
function toYoloLabelText(polygons, imgWidth, imgHeight) {
    return polygons
        .map((poly) => {
            const classId = DAMAGE_TYPES.indexOf(poly.damageType);
            const coords = poly.points
                .map((p) => `${(p.x / imgWidth).toFixed(6)} ${(p.y / imgHeight).toFixed(6)}`)
                .join(' ');
            return `${classId} ${coords}`;
        })
        .join('\n');
}

function toCocoStyleJson(image, polygons, imgWidth, imgHeight) {
    return JSON.stringify(
        {
            image: { id: image.id, file_name: image.label, width: imgWidth, height: imgHeight },
            annotations: polygons.map((poly) => ({
                id: poly.id,
                part: poly.part,
                damage_type: poly.damageType,
                segmentation: poly.points.flatMap((p) => [p.x, p.y]),
            })),
        },
        null,
        2
    );
}

// Simple centroid-distance matcher for the adjudication view — pairs up
// annotator A's polygons with the nearest annotator B polygon so a reviewer
// can see agreements vs. disagreements at a glance (Section 2.2's
// "dual-annotation + adjudication" step from docs/ARCHITECTURE.md).
function matchAnnotatorSets(setA, setB) {
    const centroid = (poly) => {
        const xs = poly.points.map((p) => p.x);
        const ys = poly.points.map((p) => p.y);
        return { x: xs.reduce((a, b) => a + b, 0) / xs.length, y: ys.reduce((a, b) => a + b, 0) / ys.length };
    };
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

    const usedB = new Set();
    const pairs = setA.map((polyA) => {
        const cA = centroid(polyA);
        let best = null;
        let bestDist = Infinity;
        setB.forEach((polyB, i) => {
            if (usedB.has(i)) return;
            const d = dist(cA, centroid(polyB));
            if (d < bestDist) { bestDist = d; best = i; }
        });
        const NEARBY_THRESHOLD = 60; // px — tune per your image resolution
        if (best !== null && bestDist < NEARBY_THRESHOLD) {
            usedB.add(best);
            const polyB = setB[best];
            const agree = polyA.part === polyB.part && polyA.damageType === polyB.damageType;
            return { polyA, polyB, status: agree ? 'agree' : 'mismatch' };
        }
        return { polyA, polyB: null, status: 'a_only' };
    });
    setB.forEach((polyB, i) => {
        if (!usedB.has(i)) pairs.push({ polyA: null, polyB, status: 'b_only' });
    });
    return pairs;
}

const AnnotationStudioPage = () => {
    const navigate = useNavigate();
    const imgRef = useRef(null);
    const [imageId, setImageId] = useState(SAMPLE_IMAGES[0].id);
    const [customImage, setCustomImage] = useState(null); // { id, label, src }
    const [annotator, setAnnotator] = useState('A');
    const [tab, setTab] = useState('annotate'); // annotate | compare

    // annotationsByAnnotator['A'][imageId] = [ {id, points, part, damageType} ]
    const [annotationsByAnnotator, setAnnotationsByAnnotator] = useState({ A: {}, B: {} });

    const [drawingPoints, setDrawingPoints] = useState([]);
    const [pendingPoly, setPendingPoly] = useState(null); // finished points, awaiting part/damage_type
    const [pendingPart, setPendingPart] = useState(PARTS[0]);
    const [pendingDamageType, setPendingDamageType] = useState(DAMAGE_TYPES[0]);
    const [selectedPolyId, setSelectedPolyId] = useState(null);
    const [imgSize, setImgSize] = useState({ w: 1, h: 1 });

    const activeImage = customImage || SAMPLE_IMAGES.find((s) => s.id === imageId) || SAMPLE_IMAGES[0];
    const currentPolygons = annotationsByAnnotator[annotator][activeImage.id] || [];

    const setPolygonsFor = (annotatorId, imgId, polys) => {
        setAnnotationsByAnnotator((prev) => ({
            ...prev,
            [annotatorId]: { ...prev[annotatorId], [imgId]: polys },
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCustomImage({ id: `custom-${file.name}`, label: file.name, src: URL.createObjectURL(file) });
        setDrawingPoints([]);
        setPendingPoly(null);
    };

    const handleCanvasClick = (e) => {
        if (pendingPoly) return; // finish/cancel the pending polygon first
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setDrawingPoints((prev) => [...prev, { x, y }]);
    };

    const finishPolygon = () => {
        if (drawingPoints.length < 3) return;
        setPendingPoly(drawingPoints);
        setDrawingPoints([]);
    };

    const cancelDrawing = () => {
        setDrawingPoints([]);
        setPendingPoly(null);
    };

    const confirmPendingPolygon = () => {
        if (!pendingPoly) return;
        const newPoly = {
            id: nextPolygonId++,
            points: pendingPoly,
            part: pendingPart,
            damageType: pendingDamageType,
        };
        setPolygonsFor(annotator, activeImage.id, [...currentPolygons, newPoly]);
        setPendingPoly(null);
    };

    const removePolygon = (id) => {
        setPolygonsFor(annotator, activeImage.id, currentPolygons.filter((p) => p.id !== id));
        if (selectedPolyId === id) setSelectedPolyId(null);
    };

    const updatePolygon = (id, patch) => {
        setPolygonsFor(annotator, activeImage.id, currentPolygons.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    };

    const handleExportYolo = () => {
        const text = toYoloLabelText(currentPolygons, imgSize.w, imgSize.h);
        downloadTextFile(`${activeImage.label.replace(/\s+/g, '_')}.txt`, text || '# no annotations yet');
    };

    const handleExportCoco = () => {
        const text = toCocoStyleJson(activeImage, currentPolygons, imgSize.w, imgSize.h);
        downloadTextFile(`${activeImage.label.replace(/\s+/g, '_')}.json`, text);
    };

    const compareSetA = annotationsByAnnotator.A[activeImage.id] || [];
    const compareSetB = annotationsByAnnotator.B[activeImage.id] || [];
    const comparisonPairs = useMemo(
        () => matchAnnotatorSets(compareSetA, compareSetB),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [compareSetA, compareSetB, activeImage.id]
    );

    return (
        <main style={{ padding: '20px 24px', fontFamily: 'Instrument Sans, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: PALETTE.primaryBlue }}>Annotation Studio</h1>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: PALETTE.muted }}>
                        Draw damage regions → export YOLO11 segmentation labels for training. See
                        ai-damage-assessment-service/training/README.md for the full annotate → train loop.
                    </p>
                </div>
                <button onClick={() => navigate(-1)} style={{ ...btn('#fff', PALETTE.muted), border: `1px solid ${PALETTE.cardBorder}` }}>← Back</button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <button onClick={() => setTab('annotate')} style={btn(tab === 'annotate' ? PALETTE.primaryBlue : '#E5E7EB', tab === 'annotate' ? '#fff' : '#374151')}>Annotate</button>
                <button onClick={() => setTab('compare')} style={btn(tab === 'compare' ? PALETTE.primaryBlue : '#E5E7EB', tab === 'compare' ? '#fff' : '#374151')}>Compare / Adjudicate</button>
            </div>

            {/* ── Image + annotator picker ─────────────────────────────── */}
            <div style={cardStyle}>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16 }}>
                    <div>
                        <label style={labelStyle}>Sample photo</label>
                        <select
                            style={inputStyle}
                            value={customImage ? '' : imageId}
                            onChange={(e) => { setCustomImage(null); setImageId(e.target.value); }}
                        >
                            {SAMPLE_IMAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>...or upload your own photo</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    {tab === 'annotate' && (
                        <div>
                            <label style={labelStyle}>Annotating as</label>
                            <select style={inputStyle} value={annotator} onChange={(e) => { setAnnotator(e.target.value); cancelDrawing(); }}>
                                <option value="A">Annotator A</option>
                                <option value="B">Annotator B</option>
                            </select>
                        </div>
                    )}
                </div>

                {tab === 'annotate' ? (
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        <div>
                            <div
                                onClick={handleCanvasClick}
                                style={{ position: 'relative', width: 480, background: '#111', borderRadius: 8, overflow: 'hidden', cursor: pendingPoly ? 'default' : 'crosshair' }}
                            >
                                <img
                                    ref={imgRef}
                                    src={activeImage.src}
                                    alt={activeImage.label}
                                    onLoad={(e) => setImgSize({ w: e.target.clientWidth, h: e.target.clientHeight })}
                                    style={{ width: '100%', display: 'block', userSelect: 'none' }}
                                    draggable={false}
                                />
                                <svg width={imgSize.w} height={imgSize.h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                                    {currentPolygons.map((poly) => (
                                        <polygon
                                            key={poly.id}
                                            points={poly.points.map((p) => `${p.x},${p.y}`).join(' ')}
                                            fill={`${DAMAGE_COLORS[poly.damageType]}33`}
                                            stroke={poly.id === selectedPolyId ? '#111827' : DAMAGE_COLORS[poly.damageType]}
                                            strokeWidth={poly.id === selectedPolyId ? 3 : 2}
                                        />
                                    ))}
                                    {drawingPoints.length > 0 && (
                                        <polyline
                                            points={drawingPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                                            fill="none" stroke="#22C55E" strokeWidth={2} strokeDasharray="4 3"
                                        />
                                    )}
                                    {drawingPoints.map((p, i) => (
                                        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#22C55E" />
                                    ))}
                                </svg>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                <button onClick={finishPolygon} disabled={drawingPoints.length < 3 || !!pendingPoly} style={btn(drawingPoints.length < 3 || pendingPoly ? '#9CA3AF' : '#059669')}>
                                    Finish Polygon ({drawingPoints.length} pts)
                                </button>
                                <button onClick={cancelDrawing} style={btn('#fff', '#DC2626')}>Cancel / Clear points</button>
                            </div>
                            <p style={{ fontSize: 12, color: PALETTE.muted, marginTop: 8 }}>
                                Click on the photo to place polygon points around a damage region, then "Finish Polygon" and tag it on the right.
                            </p>
                        </div>

                        <div style={{ flex: 1, minWidth: 260 }}>
                            {pendingPoly && (
                                <div style={{ background: '#F9FAFB', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: 14, marginBottom: 16 }}>
                                    <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 800 }}>Tag this damage region</h3>
                                    <label style={labelStyle}>Part</label>
                                    <select style={{ ...inputStyle, marginBottom: 10 }} value={pendingPart} onChange={(e) => setPendingPart(e.target.value)}>
                                        {PARTS.map((p) => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <label style={labelStyle}>Damage type</label>
                                    <select style={{ ...inputStyle, marginBottom: 12 }} value={pendingDamageType} onChange={(e) => setPendingDamageType(e.target.value)}>
                                        {DAMAGE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={confirmPendingPolygon} style={btn('#059669')}>Add Annotation</button>
                                        <button onClick={() => setPendingPoly(null)} style={btn('#fff', '#DC2626')}>Discard</button>
                                    </div>
                                </div>
                            )}

                            <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 800 }}>
                                Annotations for this photo ({annotator}) — {currentPolygons.length}
                            </h3>
                            {currentPolygons.length === 0 && (
                                <p style={{ fontSize: 12, color: PALETTE.muted }}>No annotations yet — draw one on the photo.</p>
                            )}
                            {currentPolygons.map((poly) => (
                                <div
                                    key={poly.id}
                                    onClick={() => setSelectedPolyId(poly.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                                        borderRadius: 6, marginBottom: 6, cursor: 'pointer',
                                        background: poly.id === selectedPolyId ? '#EFF6FF' : '#F9FAFB',
                                        border: `1px solid ${PALETTE.cardBorder}`,
                                    }}
                                >
                                    <span style={{ width: 12, height: 12, borderRadius: 3, background: DAMAGE_COLORS[poly.damageType], flexShrink: 0 }} />
                                    <select
                                        style={{ ...inputStyle, padding: '3px 6px', flex: 1 }}
                                        value={poly.part}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => updatePolygon(poly.id, { part: e.target.value })}
                                    >
                                        {PARTS.map((p) => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <select
                                        style={{ ...inputStyle, padding: '3px 6px', flex: 1 }}
                                        value={poly.damageType}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => updatePolygon(poly.id, { damageType: e.target.value })}
                                    >
                                        {DAMAGE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <button onClick={(e) => { e.stopPropagation(); removePolygon(poly.id); }} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
                                </div>
                            ))}

                            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                                <button onClick={handleExportYolo} style={btn(PALETTE.primaryBlue)}>Export YOLO label (.txt)</button>
                                <button onClick={handleExportCoco} style={btn('#374151')}>Export COCO-style JSON</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', width: 480, background: '#111', borderRadius: 8, overflow: 'hidden' }}>
                                <img
                                    src={activeImage.src}
                                    alt={activeImage.label}
                                    onLoad={(e) => setImgSize({ w: e.target.clientWidth, h: e.target.clientHeight })}
                                    style={{ width: '100%', display: 'block' }}
                                />
                                <svg width={imgSize.w} height={imgSize.h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                                    {compareSetA.map((poly) => (
                                        <polygon key={`a-${poly.id}`} points={poly.points.map((p) => `${p.x},${p.y}`).join(' ')} fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth={2} />
                                    ))}
                                    {compareSetB.map((poly) => (
                                        <polygon key={`b-${poly.id}`} points={poly.points.map((p) => `${p.x},${p.y}`).join(' ')} fill="rgba(249,115,22,0.15)" stroke="#F97316" strokeWidth={2} strokeDasharray="6 3" />
                                    ))}
                                </svg>
                            </div>
                            <div style={{ flex: 1, minWidth: 300 }}>
                                <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12 }}>
                                    <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#3B82F6', marginRight: 6 }} />Annotator A</span>
                                    <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#F97316', marginRight: 6 }} />Annotator B</span>
                                </div>
                                <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 800 }}>Adjudication ({comparisonPairs.length} regions)</h3>
                                {comparisonPairs.length === 0 && (
                                    <p style={{ fontSize: 12, color: PALETTE.muted }}>
                                        Annotate this photo as both A and B on the "Annotate" tab, then come back here to compare.
                                    </p>
                                )}
                                {comparisonPairs.map((pair, i) => {
                                    const tone = { agree: '#ECFDF5', mismatch: '#FEF2F2', a_only: '#EFF6FF', b_only: '#FFF7ED' }[pair.status];
                                    const label = {
                                        agree: '✓ Both annotators agree',
                                        mismatch: '⚠ Disagreement — needs adjudication',
                                        a_only: 'Only Annotator A found this',
                                        b_only: 'Only Annotator B found this',
                                    }[pair.status];
                                    return (
                                        <div key={i} style={{ background: tone, borderRadius: 6, padding: '10px 12px', marginBottom: 8, fontSize: 12 }}>
                                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
                                            {pair.polyA && <div>A: {pair.polyA.part} / {pair.polyA.damageType}</div>}
                                            {pair.polyB && <div>B: {pair.polyB.part} / {pair.polyB.damageType}</div>}
                                        </div>
                                    );
                                })}
                                <p style={{ fontSize: 11, color: PALETTE.muted, marginTop: 10 }}>
                                    This is the calibration step from docs/ARCHITECTURE.md Section 2.2 — run it on the
                                    first 10-15% of your dataset with two real annotators before scaling to the rest,
                                    to catch guideline ambiguity early.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AnnotationStudioPage;
