import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PALETTE } from '../../adminTheme';
import DonutGauge from '../components/DonutGauge';
import DamageBoxOverlay from '../components/DamageBoxOverlay';
import { SelectField } from '../components/FormFields';
import {
    detectDamage,
    assessDamage,
    generateReport,
    submitCorrection,
    getRetrainingQueueStats,
} from '../../../../services/aiDamageAssessmentApi';
import { computeImageQuality, computeAverageHash, findDuplicateIds } from '../../../../utils/aiImageAnalysis';
import { computeAiConfidence, computeDamageScore, computeFraudSignal, estimateRepairDurationDays } from '../../../../utils/aiInsightMetrics';
import {
    DEMO_VEHICLE, DEMO_CLAIM, DEMO_REPORTED_CAUSE, DEMO_DETECTIONS, DEMO_LINE_ITEMS,
    DEMO_TOTAL_COST, DEMO_NARRATIVE, DEMO_CAUSE_CHECK, DEMO_PHOTOS, DEMO_ROW_STATUS,
} from '../../../../utils/aiDemoData';

const VEHICLE_TYPES = [
    { value: 'car', label: 'Private Car' },
    { value: 'two_wheeler', label: 'Two-Wheeler' },
    { value: 'commercial_vehicle', label: 'Commercial Vehicle' },
];

const DAMAGE_TYPE_OPTIONS = ['dent', 'scratch', 'crack', 'shatter', 'deformation', 'tear', 'unknown'];
const SEVERITY_OPTIONS = ['minor', 'moderate', 'severe'];
const ACTION_OPTIONS = ['repair', 'replace', 'no_action'];
const ROW_STATUS_OPTIONS = ['Pending', 'Approval', 'In Review'];

// The app has no way to auto-detect which side/angle a photo shows (that
// would need its own small vision classifier — see docs/ARCHITECTURE.md
// Section 3, Stage 1 "vehicle type & angle classifier", not built in this
// scaffold). Until that exists, the handler assigns the angle explicitly
// via the dropdown under each thumbnail, so every photo has ***a real
// label instead of everything defaulting to "Primary Photo"***.
const ANGLE_OPTIONS = ['Front', 'Front Left', 'Front Right', 'Left', 'Right', 'Rear', 'Rear Left', 'Rear Right', 'Odometer', 'Chassis Number', 'Other'];

const inputStyle = {
    width: '100%', padding: '8px 10px', borderRadius: 6,
    border: `1px solid ${PALETTE.cardBorder}`, fontSize: 13, color: PALETTE.body,
};
const labelStyle = { fontSize: 12, fontWeight: 700, color: PALETTE.muted, marginBottom: 4, display: 'block' };
const cardStyle = {
    background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8,
    padding: 20, marginBottom: 20,
};

// Client-side CSV export of the AI Damage Assessment table -- no backend
// call needed, matches the "Export CSV" button in the reference design.
function exportDetectionsCsv(detections, assessment) {
    const header = ['Vehicle Part', 'Damage Type', 'Severity', 'Action', 'Est. Cost (INR)', 'AI Confidence (%)'];
    const rows = detections.map((d) => {
        const lineItem = assessment?.line_items.find((li) => li.part === d.part);
        return [
            d.part, d.damage_type, lineItem?.severity || '', lineItem?.action || 'no_action',
            lineItem?.line_total ?? '', Math.round(d.confidence * 100),
        ];
    });
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-damage-assessment.csv';
    link.click();
    URL.revokeObjectURL(url);
}

function Banner({ tone, children }) {
    const tones = {
        info: { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
        warn: { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E' },
        danger: { bg: '#FEF2F2', border: '#FECACA', color: '#B91C1C' },
        success: { bg: '#ECFDF5', border: '#A7F3D0', color: '#047857' },
    }[tone];
    return (
        <div style={{
            background: tones.bg, border: `1px solid ${tones.border}`, color: tones.color,
            borderRadius: 6, padding: '10px 14px', fontSize: 13, marginBottom: 16, lineHeight: 1.5,
        }}>
            {children}
        </div>
    );
}

function StatusPill({ tone, children }) {
    const tones = {
        green: { bg: '#DCFCE7', color: '#166534' },
        blue: { bg: '#DBEAFE', color: '#1D4ED8' },
        gray: { bg: '#F1F5F9', color: '#475569' },
    }[tone];
    return (
        <span style={{ background: tones.bg, color: tones.color, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
            {children}
        </span>
    );
}

const ToolbarIcon = ({ onClick, title, children }) => (
    <button
        onClick={onClick} title={title}
        style={{
            width: 30, height: 30, borderRadius: 6, border: `1px solid ${PALETTE.cardBorder}`, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: PALETTE.muted,
        }}
    >
        {children}
    </button>
);

const AiIlaAssessmentPage = () => {
    const navigate = useNavigate();

    // Claim + vehicle context
    const [claimId, setClaimId] = useState('CLM-DEMO-0001');
    const [policyNumber, setPolicyNumber] = useState('POL-00000-A');
    const [vehicleType, setVehicleType] = useState('car');
    const [make, setMake] = useState('Maruti Suzuki');
    const [model, setModel] = useState('Swift');
    const [year, setYear] = useState(2022);
    const [region, setRegion] = useState('default');
    const [reportedCause, setReportedCause] = useState('front_collision');

    // Photos: [{id, label, src, file}] -- first one is the "primary" photo
    // that detection runs against; the rest exist for the thumbnail strip
    // and the duplicate/quality checks, same as extra survey angles would.
    const [photos, setPhotos] = useState([]);
    const [primaryPhotoId, setPrimaryPhotoId] = useState(null);
    const [viewerPhotoId, setViewerPhotoId] = useState(null);

    // Toolbar (zoom/rotate/brightness) for the AI Analysis viewer
    const [zoom, setZoom] = useState(1);
    const [rotateDeg, setRotateDeg] = useState(0);
    const [brightness, setBrightness] = useState(1);

    // Pipeline state
    const [mode, setMode] = useState('idle'); // idle | demo | real
    const [stage, setStage] = useState('idle'); // idle | detecting | assessing | reporting | done | error
    const [error, setError] = useState(null);
    const [processingMs, setProcessingMs] = useState(null);

    const [originalDetection, setOriginalDetection] = useState(null);
    const [detections, setDetections] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const [originalAssessment, setOriginalAssessment] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const [report, setReport] = useState(null);

    // Real (computed, not mocked) image heuristics -- see utils/aiImageAnalysis.js
    const [imageQuality, setImageQuality] = useState(null);
    const [duplicateCount, setDuplicateCount] = useState(null);

    const [queueStats, setQueueStats] = useState(null);
    const [saveState, setSaveState] = useState('idle');

    // Row status is a local review-workflow label (Pending/Approval/In
    // Review) for the merged damage-assessment table below — it's not part
    // of the AI output itself, just how the handler tracks which rows
    // they've signed off on. Keyed by part name so it survives re-ordering.
    const [rowStatus, setRowStatus] = useState({});

    useEffect(() => {
        getRetrainingQueueStats().then(setQueueStats).catch(() => setQueueStats(null));
    }, []);

    // Recompute image quality (primary photo) + duplicate count (all
    // photos) whenever the photo set changes -- real algorithms, see
    // utils/aiImageAnalysis.js, not mocked numbers.
    useEffect(() => {
        if (photos.length === 0) {
            setImageQuality(null);
            setDuplicateCount(null);
            return;
        }
        const primary = photos.find((p) => p.id === primaryPhotoId) || photos[0];
        computeImageQuality(primary.src).then(setImageQuality).catch(() => setImageQuality(null));

        Promise.all(photos.map(async (p) => ({ id: p.id, hash: await computeAverageHash(p.src) })))
            .then((hashed) => setDuplicateCount(findDuplicateIds(hashed).size))
            .catch(() => setDuplicateCount(null));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photos, primaryPhotoId]);

    const resetResults = () => {
        setOriginalDetection(null);
        setDetections([]);
        setAssessment(null);
        setOriginalAssessment(null);
        setReport(null);
        setStage('idle');
        setError(null);
        setSaveState('idle');
        setRowStatus({});
    };

    // Next angle name not already used by an existing photo, so batches of
    // uploads get sensibly distinct default labels (Front, Rear, Left, ...)
    // instead of every photo saying the same thing.
    const nextUnusedAngle = (existingPhotos) => {
        const used = new Set(existingPhotos.map((p) => p.label));
        return ANGLE_OPTIONS.find((a) => !used.has(a)) || 'Other';
    };

    const handlePrimaryUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const id = `primary-${Date.now()}`;
        const entry = { id, label: nextUnusedAngle(photos.filter((p) => p.id !== primaryPhotoId)), src: URL.createObjectURL(file), file };
        setPhotos((prev) => [entry, ...prev.filter((p) => p.id !== primaryPhotoId)]);
        setPrimaryPhotoId(id);
        setViewerPhotoId(id);
        setMode('real');
        resetResults();
    };

    const handleAddPhoto = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setPhotos((prev) => {
            const entries = [];
            files.forEach((file, i) => {
                entries.push({
                    id: `extra-${Date.now()}-${i}`,
                    label: nextUnusedAngle([...prev, ...entries]),
                    src: URL.createObjectURL(file),
                    file,
                });
            });
            return [...prev, ...entries];
        });
    };

    const updatePhotoLabel = (id, label) => {
        setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, label } : p)));
    };

    // Lets the handler promote any uploaded photo to "primary" (the one
    // detection actually runs against) -- not just whichever was uploaded
    // first. Switching primary invalidates the current run since detections
    // belong to whichever photo they were computed from.
    const makePrimary = (id) => {
        if (id === primaryPhotoId) return;
        setPrimaryPhotoId(id);
        setViewerPhotoId(id);
        setMode('real');
        resetResults();
    };

    const runDemo = async () => {
        const startedAt = performance.now();
        setMode('demo');
        resetResults();
        setClaimId(DEMO_CLAIM.claimId);
        setPolicyNumber(DEMO_CLAIM.policyNumber);
        setMake(DEMO_VEHICLE.make);
        setModel(DEMO_VEHICLE.model);
        setYear(DEMO_VEHICLE.year);
        setRegion(DEMO_VEHICLE.region);
        setReportedCause(DEMO_REPORTED_CAUSE);

        // If the handler already uploaded their own photo, keep showing that
        // photo behind the (mocked) damage boxes instead of swapping in the
        // app's built-in placeholder images -- that's the whole point of
        // testing with your own photo. Only fall back to the placeholder set
        // when nothing has been uploaded yet.
        const hasUploadedPhoto = photos.some((p) => p.file);
        if (!hasUploadedPhoto) {
            setPhotos(DEMO_PHOTOS);
            setPrimaryPhotoId(DEMO_PHOTOS[0].id);
            setViewerPhotoId(DEMO_PHOTOS[0].id);
        } else {
            setViewerPhotoId(primaryPhotoId);
        }

        setStage('detecting');
        await new Promise((r) => setTimeout(r, 500)); // feel of a real pipeline running
        const detectionResult = { detections: DEMO_DETECTIONS, is_placeholder_model: false, model_checkpoint: 'demo-mock' };
        setOriginalDetection(detectionResult);
        setDetections(DEMO_DETECTIONS);
        setRowStatus(DEMO_ROW_STATUS);

        setStage('assessing');
        await new Promise((r) => setTimeout(r, 400));
        const assessmentResult = { line_items: DEMO_LINE_ITEMS, total_cost: DEMO_TOTAL_COST };
        setOriginalAssessment(assessmentResult);
        setAssessment(assessmentResult);

        setStage('reporting');
        await new Promise((r) => setTimeout(r, 400));
        setReport({ narrative: DEMO_NARRATIVE, cause_check: DEMO_CAUSE_CHECK, generated_by: 'demo' });

        setStage('done');
        setProcessingMs(Math.round(performance.now() - startedAt));
    };

    const runAssessment = async () => {
        const primary = photos.find((p) => p.id === primaryPhotoId);
        if (!primary?.file) {
            setError('Upload a primary photo first (or click "Run Demo").');
            return;
        }
        setMode('real');
        setError(null);
        const startedAt = performance.now();
        try {
            setStage('detecting');
            const detectionResult = await detectDamage(primary.file, vehicleType);
            setOriginalDetection(detectionResult);
            setDetections(detectionResult.detections);

            setStage('assessing');
            const vehicle = { make, model, year: Number(year), region };
            const assessmentResult = await assessDamage(vehicle, detectionResult.detections, detectionResult.photo_id);
            setOriginalAssessment(assessmentResult);
            setAssessment(assessmentResult);

            setStage('reporting');
            const reportResult = await generateReport({
                claimId, vehicle, reportedCause, detections: detectionResult.detections, assessment: assessmentResult,
            });
            setReport(reportResult);

            setStage('done');
            setProcessingMs(Math.round(performance.now() - startedAt));
        } catch (err) {
            setError(
                `${err.message || String(err)} — is the AI service running? Click "Run Demo" instead to ` +
                'try the UI without it (see ai-damage-assessment-service/README.md to set the real service up).'
            );
            setStage('error');
        }
    };

    const reassess = async (nextDetections) => {
        setDetections(nextDetections);
        if (mode === 'demo') {
            // No backend round-trip in demo mode -- keep the mocked totals as-is,
            // this is just so removing/editing a row doesn't error out.
            return;
        }
        if (!originalDetection) return;
        try {
            const vehicle = { make, model, year: Number(year), region };
            const assessmentResult = await assessDamage(vehicle, nextDetections, originalDetection.photo_id);
            setAssessment(assessmentResult);
        } catch (err) {
            setError(err.message || String(err));
        }
    };

    const updateDetection = (index, patch) => reassess(detections.map((d, i) => (i === index ? { ...d, ...patch } : d)));
    const removeDetection = (index) => { setSelectedIndex(null); reassess(detections.filter((_, i) => i !== index)); };

    const hasCorrections = originalDetection && JSON.stringify(originalDetection.detections) !== JSON.stringify(detections);

    const handleSaveCorrection = async () => {
        if (!originalDetection || !hasCorrections || mode === 'demo') return;
        setSaveState('saving');
        try {
            await submitCorrection({
                claimId, photoId: originalDetection.photo_id, vehicleType,
                aiOutput: { detections: originalDetection.detections, assessment: originalAssessment },
                correctedOutput: { detections, assessment },
                reviewerId: 'demo-handler',
                reason: 'Corrected via AI ILA Assessment screen',
            });
            setSaveState('saved');
            getRetrainingQueueStats().then(setQueueStats).catch(() => {});
        } catch (err) {
            setError(err.message || String(err));
            setSaveState('error');
        }
    };

    const busy = stage === 'detecting' || stage === 'assessing' || stage === 'reporting';
    // Show the photo viewer as soon as a photo exists -- don't wait for a
    // successful AI run first. Detections/gauges fill in progressively once
    // they're available; the photo itself shouldn't be hidden until then.
    const hasResult = photos.length > 0;
    const viewerPhoto = photos.find((p) => p.id === viewerPhotoId) || photos[0];
    const showBoxesOnViewer = viewerPhotoId === primaryPhotoId;

    const aiConfidence = computeAiConfidence(detections);
    const damageScore = assessment ? computeDamageScore(assessment.line_items) : 0;
    const fraudSignal = report ? computeFraudSignal(report.cause_check) : null;
    const repairDuration = assessment ? estimateRepairDurationDays(assessment.line_items) : 'N/A';

    return (
        <main style={{ padding: '20px 24px', fontFamily: 'Instrument Sans, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: PALETTE.primaryBlue }}>AI ILA Assessment</h1>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: PALETTE.muted }}>
                        YOLOv8 damage detection + Llama report narrative — see ai-damage-assessment-service/docs/ARCHITECTURE.md
                    </p>
                </div>
                <button onClick={() => navigate(-1)} style={{ background: '#fff', color: PALETTE.muted, border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 6, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    ← Back
                </button>
            </div>

            {queueStats && (
                <Banner tone={queueStats.threshold_reached ? 'warn' : 'info'}>
                    Retraining queue: <strong>{queueStats.pending_corrections}</strong> pending corrections
                    (threshold: {queueStats.volume_threshold}).{' '}
                    {queueStats.threshold_reached ? 'Volume threshold reached — ready for the next YOLOv8 fine-tune batch.' : 'Every correction you save below adds to this queue.'}
                </Banner>
            )}
            {error && <Banner tone="danger">{error}</Banner>}
            {mode === 'demo' && (
                <Banner tone="info">
                    <strong>Demo mode</strong> — the damage list, gauges, cost table and report below are
                    all mock data generated entirely in your browser (no backend, no Python required); the
                    numbered boxes are placed at fixed positions, not detected from pixels.{' '}
                    {photos.some((p) => p.file)
                        ? 'The boxes are drawn over the photo you uploaded, so you can see roughly where each mock damage would land on it.'
                        : 'No photo was uploaded, so this is showing the app\'s built-in placeholder car outline instead — upload your own photo first, then click "Run Demo" again, to see the boxes over your real photo.'}
                </Banner>
            )}
            {originalDetection?.is_placeholder_model && (
                <Banner tone="warn">
                    Running on the stock YOLOv8 checkpoint — no fine-tuned damage-detection weights are
                    configured yet, so detections are a placeholder (whole-vehicle outline only), not real
                    damage regions. See Section 6 of the architecture doc.
                </Banner>
            )}

            {/* ── Setup ─────────────────────────────────────────────────── */}
            <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                    <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: PALETTE.body }}>Claim & Vehicle</h2>
                    <button
                        onClick={runDemo}
                        disabled={busy}
                        style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.6 : 1 }}
                    >
                        ▶ Run Demo (no backend needed)
                    </button>
                </div>
                <div className="im-grid-auto" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <div><label style={labelStyle}>Claim ID</label><input style={inputStyle} value={claimId} onChange={(e) => setClaimId(e.target.value)} /></div>
                    <div><label style={labelStyle}>Policy Number</label><input style={inputStyle} value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} /></div>
                    <div>
                        <label style={labelStyle}>Vehicle Type</label>
                        <SelectField value={vehicleType} onChange={setVehicleType} options={VEHICLE_TYPES} placeholder="Select Vehicle Type" />
                    </div>
                    <div><label style={labelStyle}>Make</label><input style={inputStyle} value={make} onChange={(e) => setMake(e.target.value)} /></div>
                    <div><label style={labelStyle}>Model</label><input style={inputStyle} value={model} onChange={(e) => setModel(e.target.value)} /></div>
                    <div><label style={labelStyle}>Year</label><input type="number" style={inputStyle} value={year} onChange={(e) => setYear(e.target.value)} /></div>
                    <div><label style={labelStyle}>Region</label><input style={inputStyle} value={region} onChange={(e) => setRegion(e.target.value)} /></div>
                    <div><label style={labelStyle}>Reported Cause of Loss</label><input style={inputStyle} value={reportedCause} onChange={(e) => setReportedCause(e.target.value)} /></div>
                </div>

                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 18, alignItems: 'flex-end' }}>
                    <div>
                        <label style={labelStyle}>Primary inspection photo (detection runs on this one)</label>
                        <input type="file" accept="image/*" onChange={handlePrimaryUpload} />
                    </div>
                    <div>
                        <label style={labelStyle}>+ Additional angle photos (thumbnail strip / duplicate check only)</label>
                        <input type="file" accept="image/*" multiple onChange={handleAddPhoto} disabled={!primaryPhotoId} />
                    </div>
                    <button
                        onClick={runAssessment}
                        disabled={!primaryPhotoId || busy}
                        style={{ background: PALETTE.primaryBlue, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', fontSize: 13, fontWeight: 700, cursor: !primaryPhotoId || busy ? 'not-allowed' : 'pointer', opacity: !primaryPhotoId || busy ? 0.6 : 1 }}
                    >
                        {busy ? `Running (${stage})…` : 'Run AI Assessment'}
                    </button>
                </div>
                <p style={{ fontSize: 12, color: PALETTE.muted, marginTop: 10 }}>
                    "Run AI Assessment" calls the AI Damage Assessment Service (default <code>http://localhost:8000</code>) —
                    see its README to set it up. "Run Demo" needs nothing at all.
                </p>
            </div>

            {hasResult && (
                <>
                    {/* ── Claim header bar (matches the reference design) ──── */}
                    <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: PALETTE.primaryBlue }}>{year} {make} {model}</h2>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: PALETTE.muted }}>Claim {claimId} &nbsp;·&nbsp; Policy {policyNumber}</p>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: PALETTE.muted, textTransform: 'uppercase' }}>Claim Date</p>
                            <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700 }}>{new Date().toLocaleDateString('en-IN')}</p>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: PALETTE.muted, textTransform: 'uppercase' }}>Survey</p>
                            <StatusPill tone="green">Completed</StatusPill>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: PALETTE.muted, textTransform: 'uppercase' }}>AI Processing</p>
                            <StatusPill tone={stage === 'done' ? 'blue' : 'gray'}>{stage === 'done' ? 'Analysis Complete' : stage}</StatusPill>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {/* ── AI Analysis viewer ─────────────────────────────── */}
                        <div style={{ ...cardStyle, flex: 2, minWidth: 'min(380px, 100%)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>AI Analysis</h2>
                                    <p style={{ margin: '2px 0 10px', fontSize: 12, color: PALETTE.muted }}>Survey Image — {viewerPhoto?.label}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <ToolbarIcon title="Zoom in" onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}>+</ToolbarIcon>
                                    <ToolbarIcon title="Zoom out" onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}>−</ToolbarIcon>
                                    <ToolbarIcon title="Rotate" onClick={() => setRotateDeg((r) => (r + 90) % 360)}>↻</ToolbarIcon>
                                    <ToolbarIcon title="Brightness" onClick={() => setBrightness((b) => (b >= 1.6 ? 0.8 : b + 0.2))}>☀</ToolbarIcon>
                                    <ToolbarIcon title="Reset" onClick={() => { setZoom(1); setRotateDeg(0); setBrightness(1); }}>⤾</ToolbarIcon>
                                </div>
                            </div>

                            {viewerPhoto && (
                                <DamageBoxOverlay
                                    imageUrl={viewerPhoto.src}
                                    detections={showBoxesOnViewer ? detections : []}
                                    selectedIndex={selectedIndex}
                                    onSelect={setSelectedIndex}
                                    filters={{ zoom, rotateDeg, brightness }}
                                />
                            )}

                            {photos.length > 0 && (
                                <div style={{ display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto', paddingBottom: 4 }}>
                                    {photos.map((p) => (
                                        <div key={p.id} style={{ flexShrink: 0, width: 84 }}>
                                            <button
                                                onClick={() => setViewerPhotoId(p.id)}
                                                style={{
                                                    border: p.id === viewerPhotoId ? `2px solid ${PALETTE.primaryBlue}` : '2px solid transparent',
                                                    borderRadius: 8, padding: 0, cursor: 'pointer', background: '#F1F5F9',
                                                    position: 'relative', width: 84, height: 56, overflow: 'hidden', display: 'block',
                                                }}
                                                title={p.label}
                                            >
                                                <img src={p.src} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                {p.id === primaryPhotoId ? (
                                                    <span style={{ position: 'absolute', top: 2, left: 2, background: PALETTE.primaryBlue, color: '#fff', fontSize: 8, fontWeight: 700, padding: '1px 4px', borderRadius: 3 }}>PRIMARY</span>
                                                ) : (
                                                    <span
                                                        onClick={(e) => { e.stopPropagation(); makePrimary(p.id); }}
                                                        style={{ position: 'absolute', top: 2, left: 2, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 8, fontWeight: 700, padding: '1px 4px', borderRadius: 3, cursor: 'pointer' }}
                                                    >
                                                        Set primary
                                                    </span>
                                                )}
                                            </button>
                                            <div style={{ marginTop: 4, fontSize: 10 }}>
                                                <SelectField
                                                    value={p.label}
                                                    onChange={(v) => updatePhotoLabel(p.id, v)}
                                                    options={ANGLE_OPTIONS.includes(p.label) ? ANGLE_OPTIONS : [p.label, ...ANGLE_OPTIONS]}
                                                    placeholder="Angle"
                                                    compact
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p style={{ fontSize: 11, color: PALETTE.muted, marginTop: 8 }}>
                                The angle label under each photo is set by you, not auto-detected — there's no
                                "which side is this" classifier in this scaffold yet (see docs/ARCHITECTURE.md
                                Section 3, Stage 1). Click "Set primary" on any thumbnail to run AI detection
                                against that photo instead.
                            </p>
                        </div>

                        {/* ── AI Assessment Insights ─────────────────────────── */}
                        <div style={{ ...cardStyle, flex: 1, minWidth: 'min(260px, 100%)' }}>
                            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>AI Assessment Insights</h2>
                            <p style={{ margin: '2px 0 16px', fontSize: 12, color: PALETTE.muted }}>Model Diagnostics</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                <DonutGauge percent={aiConfidence} color="#3B82F6" valueText={`${aiConfidence}%`} label="AI Confidence" />
                                <DonutGauge percent={damageScore} color="#F59E0B" valueText={`${damageScore}`} label="Damage Score /100" />
                                <DonutGauge percent={fraudSignal ?? 0} color="#10B981" valueText={fraudSignal != null ? `${fraudSignal}%` : '—'} label="Fraud Probability" />
                                <DonutGauge percent={imageQuality ?? 0} color="#10B981" valueText={imageQuality != null ? `${imageQuality}%` : '…'} label="Image Quality" />
                            </div>

                            {[
                                ['Duplicate Images', duplicateCount != null ? `${duplicateCount} Of ${photos.length}` : '…'],
                                ['Previous Claim Match', 'No Matches'],
                                ['AI Processing Time', processingMs != null ? `${(processingMs / 1000).toFixed(1)}s` : '—'],
                                ['Est Repair Duration', repairDuration],
                            ].map(([label, value]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${PALETTE.borderLight}`, fontSize: 13 }}>
                                    <span style={{ color: PALETTE.muted }}>{label}</span>
                                    <span style={{ fontWeight: 700 }}>{value}</span>
                                </div>
                            ))}
                            <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 10, lineHeight: 1.5 }}>
                                AI Confidence/Image Quality/Duplicates are computed for real (from the actual
                                photo(s) and detections above). Damage Score and Fraud Probability are rule-based
                                summaries of the assessment/cause-check, not separately trained models — see
                                src/utils/aiInsightMetrics.js. "Previous Claim Match" needs a claims-history
                                integration that doesn't exist yet.
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* ── AI Damage Assessment (merged detections + cost, editable) ── */}
            {detections.length > 0 && (
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: PALETTE.primaryBlue, letterSpacing: 0.5 }}>DETECTED</p>
                            <h2 style={{ margin: '2px 0 0', fontSize: 17, fontWeight: 800, color: PALETTE.body }}>AI Damage Assessment</h2>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: PALETTE.muted }}>
                                {detections.length} Parts Identified · Ordered By Severity
                                {hasCorrections && <span style={{ color: '#B45309', fontWeight: 700 }}> · Edited — not yet saved as a correction</span>}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <button
                                onClick={() => exportDetectionsCsv(detections, assessment)}
                                style={{ background: '#fff', color: PALETTE.primaryBlue, border: `1px solid ${PALETTE.primaryBlue}`, borderRadius: 6, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                                Export CSV
                            </button>
                            <button
                                onClick={() => setRowStatus(Object.fromEntries(detections.map((d) => [d.part, 'Approval'])))}
                                style={{ background: PALETTE.primaryBlue, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                                Approve All
                            </button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 760 }}>
                            <thead>
                                <tr style={{ background: '#F9FAFB' }}>
                                    {['#', 'Vehicle Part', 'Damage Type', 'Severity', 'Action', 'Est. Cost (₹)', 'AI Confidence', 'Status', ''].map((h) => (
                                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: 11, textTransform: 'uppercase', borderBottom: `1px solid ${PALETTE.cardBorder}` }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {detections.map((d, i) => {
                                    const lineItem = assessment?.line_items.find((li) => li.part === d.part);
                                    const status = rowStatus[d.part] || 'Pending';
                                    const confidencePct = Math.round(d.confidence * 100);
                                    return (
                                        <tr key={i} style={{ borderBottom: '1px solid #F3F4F6', background: i === selectedIndex ? '#FEF2F2' : 'transparent', cursor: 'pointer' }} onClick={() => setSelectedIndex(i)}>
                                            <td style={{ padding: '8px 12px' }}>
                                                <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#F1F5F9', color: PALETTE.muted, fontWeight: 700, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '8px 12px', fontWeight: 700 }}>
                                                <input style={{ ...inputStyle, padding: '4px 8px', fontWeight: 700 }} value={d.part} onClick={(e) => e.stopPropagation()} onChange={(e) => updateDetection(i, { part: e.target.value })} />
                                            </td>
                                            <td style={{ padding: '8px 12px' }} onClick={(e) => e.stopPropagation()}>
                                                <SelectField value={d.damage_type} onChange={(v) => updateDetection(i, { damage_type: v })} options={DAMAGE_TYPE_OPTIONS} compact />
                                            </td>
                                            <td style={{ padding: '8px 12px' }} onClick={(e) => e.stopPropagation()}>
                                                <SelectField
                                                    value={lineItem?.severity || ''}
                                                    options={SEVERITY_OPTIONS.map((opt) => ({ value: opt, label: opt[0].toUpperCase() + opt.slice(1) }))}
                                                    placeholder={lineItem ? '—' : 'N/A'}
                                                    disabled={!lineItem}
                                                    compact
                                                />
                                            </td>
                                            <td style={{ padding: '8px 12px' }} onClick={(e) => e.stopPropagation()}>
                                                <SelectField
                                                    value={lineItem?.action || 'no_action'}
                                                    options={ACTION_OPTIONS.map((opt) => ({ value: opt, label: opt.replace('_', ' ') }))}
                                                    disabled={!lineItem}
                                                    compact
                                                />
                                            </td>
                                            <td style={{ padding: '8px 12px', fontWeight: 700 }}>
                                                {lineItem ? lineItem.line_total.toLocaleString('en-IN') : '—'}
                                            </td>
                                            <td style={{ padding: '8px 12px', minWidth: 110 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#F1F5F9' }}>
                                                        <div style={{ width: `${confidencePct}%`, height: '100%', borderRadius: 3, background: confidencePct >= 90 ? '#10B981' : confidencePct >= 75 ? '#3B82F6' : '#F59E0B' }} />
                                                    </div>
                                                    <span style={{ fontSize: 12, fontWeight: 700, color: PALETTE.muted, flexShrink: 0 }}>{confidencePct}%</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '8px 12px' }} onClick={(e) => e.stopPropagation()}>
                                                <SelectField
                                                    value={status}
                                                    onChange={(v) => setRowStatus((prev) => ({ ...prev, [d.part]: v }))}
                                                    options={ROW_STATUS_OPTIONS}
                                                    compact
                                                />
                                            </td>
                                            <td style={{ padding: '8px 12px' }}>
                                                <button onClick={(e) => { e.stopPropagation(); removeDetection(i); }} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Remove</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {assessment && (
                        <p style={{ margin: '14px 0 0', fontSize: 12, color: PALETTE.muted }}>
                            {assessment.line_items.filter((li) => li.action === 'repair').length} repair ·{' '}
                            {assessment.line_items.filter((li) => li.action === 'replace').length} replace ·{' '}
                            ₹{assessment.total_cost.toLocaleString('en-IN')} total est.
                        </p>
                    )}

                    <div style={{ marginTop: 16, textAlign: 'right' }}>
                        {mode === 'demo' ? (
                            <span style={{ fontSize: 12, color: PALETTE.muted }}>Corrections aren't saved in demo mode — switch to a real photo run to test this.</span>
                        ) : (
                            <button
                                onClick={handleSaveCorrection}
                                disabled={!hasCorrections || saveState === 'saving'}
                                style={{ background: hasCorrections ? '#059669' : '#9CA3AF', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: hasCorrections ? 'pointer' : 'not-allowed' }}
                            >
                                {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved to retraining queue ✓' : 'Save Correction'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ── Cost breakdown (part/labor/paint detail) ─────────────── */}
            {assessment && (
                <div style={cardStyle}>
                    <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: PALETTE.body }}>Cost Breakdown (AI ILA)</h2>
                    <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
                        <thead>
                            <tr style={{ background: '#F9FAFB' }}>
                                {['Part', 'Severity', 'Action', 'Part Cost', 'Labor', 'Paint/Consumables', 'Line Total', 'Rate Source'].map((h) => (
                                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: 12, borderBottom: `1px solid ${PALETTE.cardBorder}` }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {assessment.line_items.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{item.part}</td>
                                    <td style={{ padding: '8px 12px' }}>
                                        <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: item.severity === 'severe' ? '#FEE2E2' : item.severity === 'moderate' ? '#FEF3C7' : '#DCFCE7', color: item.severity === 'severe' ? '#B91C1C' : item.severity === 'moderate' ? '#92400E' : '#166534' }}>
                                            {item.severity}
                                        </span>
                                    </td>
                                    <td style={{ padding: '8px 12px', textTransform: 'capitalize' }}>{item.action}</td>
                                    <td style={{ padding: '8px 12px' }}>₹{item.part_cost.toLocaleString('en-IN')}</td>
                                    <td style={{ padding: '8px 12px' }}>₹{item.labor_cost.toLocaleString('en-IN')}</td>
                                    <td style={{ padding: '8px 12px' }}>₹{item.paint_consumables_cost.toLocaleString('en-IN')}</td>
                                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>₹{item.line_total.toLocaleString('en-IN')}</td>
                                    <td style={{ padding: '8px 12px', color: item.rate_source === 'fallback_estimate' ? '#B45309' : PALETTE.muted, fontSize: 11 }}>
                                        {item.rate_source === 'fallback_estimate' ? 'estimate (no rate row)' : 'parts rate DB'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={6} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>Total Estimated Cost (AI ILA)</td>
                                <td colSpan={2} style={{ padding: '10px 12px', fontWeight: 800, fontSize: 15, color: PALETTE.primaryBlue }}>₹{assessment.total_cost.toLocaleString('en-IN')}</td>
                            </tr>
                        </tfoot>
                    </table>
                    </div>
                </div>
            )}

            {/* ── Report narrative + cause-consistency ─────────────────── */}
            {report && (
                <div style={cardStyle}>
                    <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: PALETTE.body }}>ILA Report</h2>
                    {report.generated_by !== 'llama' && report.generated_by !== 'demo' && (
                        <Banner tone="warn">Ollama isn't reachable — this is a templated summary, not an LLM-generated narrative. Run <code>ollama serve</code> to enable real report generation.</Banner>
                    )}
                    <Banner tone={report.cause_check.is_consistent ? 'success' : 'danger'}>
                        <strong>Cause-consistency check ({(report.cause_check.consistency_score * 100).toFixed(0)}%):</strong> {report.cause_check.explanation}
                    </Banner>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 13, lineHeight: 1.7, background: '#F9FAFB', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 8, padding: 16, color: PALETTE.body, margin: 0 }}>
                        {report.narrative}
                    </pre>
                </div>
            )}
        </main>
    );
};

export default AiIlaAssessmentPage;
