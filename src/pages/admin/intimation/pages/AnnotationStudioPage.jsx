import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PALETTE } from '../../adminTheme';
import {
    annotationPhotoFileUrl,
    cancelTraining,
    deleteAnnotationPhoto,
    getTrainingStatus,
    listAnnotationPhotos,
    saveAnnotation,
    startTraining,
    trainingReportImageUrl,
    uploadAnnotationPhotos,
} from '../../../../services/aiDamageAssessmentApi';

// Matches server/src/schemas/constants.js's TRAINABLE_DAMAGE_TYPES (the
// backend looks up the class id by name, so the two lists don't need to be
// in the same order -- just the same vocabulary) and PARTS.
const VEHICLE_TYPES = [
    { value: 'car', label: 'Car' },
    { value: 'two_wheeler', label: 'Two Wheeler' },
    { value: 'commercial_vehicle', label: 'Commercial Vehicle' },
];
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

// Converts the studio's local {x,y}-point polygons into the [[x,y],...]
// tuple shape the backend's save endpoint expects.
function toSavePayload(polygons) {
    return polygons.map((poly) => ({
        part: poly.part,
        damage_type: poly.damageType,
        points: poly.points.map((p) => [p.x, p.y]),
    }));
}

// Reverse of the above, for pre-loading a photo's already-saved annotations
// back into the editor's {x,y}-point shape.
function fromSavedAnnotations(annotations) {
    return (annotations || []).map((a) => ({
        id: nextPolygonId++,
        part: a.part,
        damageType: a.damage_type,
        points: a.points.map(([x, y]) => ({ x, y })),
    }));
}

const AnnotationStudioPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [vehicleType, setVehicleType] = useState('car');
    const [photos, setPhotos] = useState([]);
    const [photosLoading, setPhotosLoading] = useState(false);
    const [photosError, setPhotosError] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [activePhotoId, setActivePhotoId] = useState(null);
    const [polygons, setPolygons] = useState([]);
    const [drawingPoints, setDrawingPoints] = useState([]);
    const [pendingPoly, setPendingPoly] = useState(null);
    const [pendingPart, setPendingPart] = useState(PARTS[0]);
    const [pendingDamageType, setPendingDamageType] = useState(DAMAGE_TYPES[0]);
    const [selectedPolyId, setSelectedPolyId] = useState(null);
    const [imgSize, setImgSize] = useState({ w: 1, h: 1 });

    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    const [trainEpochs, setTrainEpochs] = useState(100);
    const [trainBase, setTrainBase] = useState('yolo11l-seg.pt');
    const [trainDevice, setTrainDevice] = useState('cpu');
    // Empty = let the server auto-pick (low on CPU -- a large checkpoint at
    // the default batch reliably crashes with an out-of-memory access
    // violation on CPU-only machines; see server/src/routes/training.js).
    const [trainBatch, setTrainBatch] = useState('');
    const [trainJob, setTrainJob] = useState(null); // last-known /training/status response
    const [trainStartError, setTrainStartError] = useState(null);
    const trainPollRef = useRef(null);

    const activePhoto = photos.find((p) => p.id === activePhotoId) || null;
    const isTrainingActive = trainJob && (trainJob.status === 'preparing' || trainJob.status === 'training');

    // Poll /training/status every 2s while a job is running (and once on
    // mount, in case a job from an earlier page visit is still going).
    useEffect(() => {
        const poll = async () => {
            try {
                const status = await getTrainingStatus();
                setTrainJob(status);
            } catch {
                /* backend not reachable -- leave last-known state, upload/list already surfaces this error */
            }
        };
        poll();
        trainPollRef.current = setInterval(() => {
            setTrainJob((prev) => {
                if (prev && prev.status !== 'preparing' && prev.status !== 'training') {
                    clearInterval(trainPollRef.current);
                    return prev;
                }
                poll();
                return prev;
            });
        }, 2000);
        return () => clearInterval(trainPollRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStartTraining = async () => {
        setTrainStartError(null);
        try {
            const result = await startTraining({
                vehicleType, epochs: Number(trainEpochs), base: trainBase, device: trainDevice,
                batch: trainBatch ? Number(trainBatch) : undefined,
            });
            setTrainJob(result.job);
            clearInterval(trainPollRef.current);
            trainPollRef.current = setInterval(async () => {
                const status = await getTrainingStatus().catch(() => null);
                if (!status) return;
                setTrainJob(status);
                if (status.status !== 'preparing' && status.status !== 'training') {
                    clearInterval(trainPollRef.current);
                }
            }, 2000);
        } catch (err) {
            setTrainStartError(err.message);
        }
    };

    const handleCancelTraining = async () => {
        try {
            await cancelTraining();
        } catch (err) {
            setTrainStartError(err.message);
        }
    };

    const refreshPhotos = useCallback(async (selectId) => {
        setPhotosLoading(true);
        setPhotosError(null);
        try {
            const result = await listAnnotationPhotos(vehicleType);
            setPhotos(result.photos);
            if (selectId) setActivePhotoId(selectId);
        } catch (err) {
            setPhotosError(err.message);
        } finally {
            setPhotosLoading(false);
        }
    }, [vehicleType]);

    useEffect(() => {
        setActivePhotoId(null);
        refreshPhotos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicleType]);

    const openPhoto = (photo) => {
        setActivePhotoId(photo.id);
        setPolygons(fromSavedAnnotations(photo.annotations));
        setDrawingPoints([]);
        setPendingPoly(null);
        setSelectedPolyId(null);
        setSaveMessage(null);
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFilesSelected = async (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = ''; // allow re-selecting the same file(s) later
        if (files.length === 0) return;

        setUploading(true);
        setPhotosError(null);
        try {
            const result = await uploadAnnotationPhotos(files, vehicleType);
            await refreshPhotos(result.photos[0]?.id);
        } catch (err) {
            setPhotosError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async (e, photoId) => {
        e.stopPropagation();
        if (!window.confirm('Delete this photo and its annotation?')) return;
        try {
            await deleteAnnotationPhoto(photoId);
            if (activePhotoId === photoId) setActivePhotoId(null);
            await refreshPhotos();
        } catch (err) {
            setPhotosError(err.message);
        }
    };

    const handleCanvasClick = (e) => {
        if (!activePhoto || pendingPoly) return;
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
        const newPoly = { id: nextPolygonId++, points: pendingPoly, part: pendingPart, damageType: pendingDamageType };
        setPolygons((prev) => [...prev, newPoly]);
        setPendingPoly(null);
    };

    const removePolygon = (id) => {
        setPolygons((prev) => prev.filter((p) => p.id !== id));
        if (selectedPolyId === id) setSelectedPolyId(null);
    };

    const updatePolygon = (id, patch) => {
        setPolygons((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    };

    const handleSaveAnnotation = async () => {
        if (!activePhoto) return;
        setSaving(true);
        setSaveMessage(null);
        try {
            const updated = await saveAnnotation(activePhoto.id, {
                imageWidth: imgSize.w,
                imageHeight: imgSize.h,
                polygons: toSavePayload(polygons),
            });
            setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setSaveMessage(`Saved ✓ — ${polygons.length} annotation(s) written to the training raw pool.`);
        } catch (err) {
            setSaveMessage(`Save failed: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main style={{ padding: '20px 24px', fontFamily: 'Instrument Sans, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: PALETTE.primaryBlue }}>Annotation Studio</h1>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: PALETTE.muted }}>
                        Upload real damage photos, draw polygons around damage, tag them, and save — this writes
                        directly into ai-damage-assessment-service/training/raw_pool, ready for prepare_dataset.py.
                    </p>
                </div>
                <button onClick={() => navigate(-1)} style={{ ...btn('#fff', PALETTE.muted), border: `1px solid ${PALETTE.cardBorder}` }}>← Back</button>
            </div>

            {/* ── Upload + vehicle type + thumbnail grid ───────────────── */}
            <div style={cardStyle}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 16 }}>
                    <div>
                        <label style={labelStyle}>Vehicle type</label>
                        <select style={inputStyle} value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                            {VEHICLE_TYPES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFilesSelected}
                        />
                        <button onClick={handleUploadClick} disabled={uploading} style={btn(uploading ? '#9CA3AF' : PALETTE.primaryBlue)}>
                            {uploading ? 'Uploading…' : '+ Upload Photos'}
                        </button>
                        <div style={{ fontSize: 11, color: PALETTE.muted, marginTop: 4 }}>Supported: JPG, JPEG, PNG — multiple at once</div>
                    </div>
                    <button onClick={() => refreshPhotos()} disabled={photosLoading} style={{ ...btn('#fff', PALETTE.muted), border: `1px solid ${PALETTE.cardBorder}` }}>
                        {photosLoading ? 'Refreshing…' : '↻ Refresh'}
                    </button>
                </div>

                {photosError && (
                    <div style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: 6, padding: '8px 12px', fontSize: 12, marginBottom: 12 }}>
                        {photosError.includes('fetch') || photosError.includes('NetworkError')
                            ? `Could not reach the AI service — is ai-damage-assessment-service/server running (npm start on port 8000)? (${photosError})`
                            : photosError}
                    </div>
                )}

                {photos.length === 0 && !photosLoading && (
                    <p style={{ fontSize: 12, color: PALETTE.muted }}>
                        No photos uploaded yet for {VEHICLE_TYPES.find((v) => v.value === vehicleType)?.label}. Click "+ Upload Photos" to add some.
                    </p>
                )}

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            onClick={() => openPhoto(photo)}
                            style={{
                                position: 'relative', width: 110, cursor: 'pointer',
                                border: `2px solid ${activePhotoId === photo.id ? PALETTE.primaryBlue : PALETTE.cardBorder}`,
                                borderRadius: 8, overflow: 'hidden', background: '#111',
                            }}
                            title={photo.original_filename}
                        >
                            <img src={annotationPhotoFileUrl(photo.file_url)} alt={photo.original_filename} style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} />
                            <div style={{ background: '#fff', fontSize: 10, padding: '3px 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {photo.original_filename}
                            </div>
                            {photo.annotated && (
                                <span style={{ position: 'absolute', top: 4, left: 4, background: '#059669', color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 6px', fontWeight: 700 }}>✓ annotated</span>
                            )}
                            <button
                                onClick={(e) => handleDeletePhoto(e, photo.id)}
                                title="Delete photo"
                                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 12, lineHeight: 1, cursor: 'pointer' }}
                            >×</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Editor ────────────────────────────────────────────────── */}
            <div style={cardStyle}>
                {!activePhoto ? (
                    <p style={{ fontSize: 13, color: PALETTE.muted, margin: 0 }}>
                        Select a photo above to start annotating.
                    </p>
                ) : (
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        <div>
                            <div
                                onClick={handleCanvasClick}
                                style={{ position: 'relative', width: 480, background: '#111', borderRadius: 8, overflow: 'hidden', cursor: pendingPoly ? 'default' : 'crosshair' }}
                            >
                                <img
                                    src={annotationPhotoFileUrl(activePhoto.file_url)}
                                    alt={activePhoto.original_filename}
                                    onLoad={(e) => setImgSize({ w: e.target.clientWidth, h: e.target.clientHeight })}
                                    style={{ width: '100%', display: 'block', userSelect: 'none' }}
                                    draggable={false}
                                />
                                <svg width={imgSize.w} height={imgSize.h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                                    {polygons.map((poly) => (
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
                                    <label style={labelStyle}>Class (damage type)</label>
                                    <select data-testid="polygon-class-select" style={{ ...inputStyle, marginBottom: 10 }} value={pendingDamageType} onChange={(e) => setPendingDamageType(e.target.value)}>
                                        {DAMAGE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <label style={labelStyle}>Part</label>
                                    <select data-testid="polygon-part-select" style={{ ...inputStyle, marginBottom: 12 }} value={pendingPart} onChange={(e) => setPendingPart(e.target.value)}>
                                        {PARTS.map((p) => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button data-testid="add-annotation-btn" onClick={confirmPendingPolygon} style={btn('#059669')}>Add Annotation</button>
                                        <button onClick={() => setPendingPoly(null)} style={btn('#fff', '#DC2626')}>Discard</button>
                                    </div>
                                </div>
                            )}

                            <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 800 }}>
                                Annotations for this photo — {polygons.length}
                            </h3>
                            {polygons.length === 0 && (
                                <p style={{ fontSize: 12, color: PALETTE.muted }}>No annotations yet — draw one on the photo.</p>
                            )}
                            {polygons.map((poly) => (
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
                                        value={poly.damageType}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => updatePolygon(poly.id, { damageType: e.target.value })}
                                    >
                                        {DAMAGE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <select
                                        style={{ ...inputStyle, padding: '3px 6px', flex: 1 }}
                                        value={poly.part}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => updatePolygon(poly.id, { part: e.target.value })}
                                    >
                                        {PARTS.map((p) => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <button onClick={(e) => { e.stopPropagation(); removePolygon(poly.id); }} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
                                </div>
                            ))}

                            <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
                                <button onClick={handleSaveAnnotation} disabled={saving || polygons.length === 0} style={btn(saving || polygons.length === 0 ? '#9CA3AF' : '#059669')}>
                                    {saving ? 'Saving…' : 'Save Annotation'}
                                </button>
                            </div>
                            {saveMessage && (
                                <p style={{ fontSize: 12, marginTop: 10, color: saveMessage.startsWith('Save failed') ? '#DC2626' : '#059669', fontWeight: 600 }}>
                                    {saveMessage}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Train Model ───────────────────────────────────────────── */}
            <div style={cardStyle}>
                <h2 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800 }}>Train Model</h2>
                <p style={{ margin: '0 0 16px', fontSize: 12, color: PALETTE.muted }}>
                    Runs <code>prepare_dataset.py</code> then <code>train.py</code> on the server for{' '}
                    <b>{VEHICLE_TYPES.find((v) => v.value === vehicleType)?.label}</b> using everything saved in the
                    raw pool so far (annotated photos above, plus any bundled sample data). No terminal needed.
                </p>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16 }}>
                    <div>
                        <label style={labelStyle}>Epochs</label>
                        <input
                            type="number" min={1} max={1000} style={{ ...inputStyle, width: 100 }}
                            value={trainEpochs} onChange={(e) => setTrainEpochs(e.target.value)}
                            disabled={isTrainingActive}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Base checkpoint</label>
                        <select style={inputStyle} value={trainBase} onChange={(e) => setTrainBase(e.target.value)} disabled={isTrainingActive}>
                            <option value="yolo11n-seg.pt">yolo11n-seg.pt (nano — fast, for quick tests)</option>
                            <option value="yolo11l-seg.pt">yolo11l-seg.pt (large — per architecture spec)</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Device</label>
                        <select style={inputStyle} value={trainDevice} onChange={(e) => setTrainDevice(e.target.value)} disabled={isTrainingActive}>
                            <option value="cpu">CPU</option>
                            <option value="0">GPU 0</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Batch size</label>
                        <input
                            type="number" min={1} max={256} placeholder={trainDevice === 'cpu' ? 'auto (2)' : 'auto (16)'}
                            style={{ ...inputStyle, width: 110 }}
                            value={trainBatch} onChange={(e) => setTrainBatch(e.target.value)}
                            disabled={isTrainingActive}
                        />
                    </div>
                    {!isTrainingActive ? (
                        <button onClick={handleStartTraining} style={btn('#059669')}>▶ Start Training</button>
                    ) : (
                        <button onClick={handleCancelTraining} style={btn('#DC2626')}>■ Cancel Training</button>
                    )}
                </div>

                {trainDevice === 'cpu' && trainBase === 'yolo11l-seg.pt' && !trainBatch && (
                    <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '8px 12px', fontSize: 11, color: '#92400E', marginBottom: 14 }}>
                        ⚠ Large checkpoint + CPU: batch will auto-default to 2 (a higher batch reliably crashes with an
                        out-of-memory error on CPU — happened during testing). Training will be slow; use the nano
                        checkpoint for quick tests, or a GPU for real runs.
                    </div>
                )}

                {trainStartError && (
                    <div style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: 6, padding: '8px 12px', fontSize: 12, marginBottom: 12 }}>
                        {trainStartError}
                    </div>
                )}

                {trainJob && trainJob.status !== 'idle' && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{
                                display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 800, color: '#fff',
                                background: {
                                    preparing: '#F59E0B', training: '#2563EB', completed: '#059669', failed: '#DC2626', cancelled: '#6B7280',
                                }[trainJob.status] || '#6B7280',
                            }}>
                                {trainJob.status.toUpperCase()}
                            </span>
                            <span style={{ fontSize: 12, color: PALETTE.muted }}>
                                {trainJob.vehicle_type} · {trainJob.epochs} epochs · batch {trainJob.batch} · started {trainJob.started_at ? new Date(trainJob.started_at).toLocaleTimeString() : '—'}
                            </span>
                        </div>

                        {trainJob.status === 'completed' && trainJob.result_checkpoint && (
                            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 6, padding: '10px 12px', fontSize: 12, marginBottom: 10 }}>
                                <b>✓ Training complete.</b> Checkpoint saved at:
                                <div style={{ fontFamily: 'monospace', marginTop: 4, wordBreak: 'break-all' }}>{trainJob.result_checkpoint}</div>
                                <div style={{ marginTop: 6, color: PALETTE.muted }}>
                                    To use it, set the matching env var in <code>yolo-service/.env</code> (e.g. <code>YOLO_CAR_WEIGHTS=&lt;path above&gt;</code>)
                                    and restart yolo-service — see docs/ARCHITECTURE.md Section 5 before promoting to production (validate, then shadow mode).
                                </div>
                            </div>
                        )}
                        {trainJob.status === 'failed' && trainJob.error && (
                            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 6, padding: '10px 12px', fontSize: 12, marginBottom: 10, color: '#DC2626' }}>
                                {trainJob.error}
                            </div>
                        )}

                        {trainJob.report && (
                            <div style={{ marginBottom: 16 }}>
                                <h3 style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 800 }}>
                                    Training Report {trainJob.status !== 'completed' && '(partial — job did not finish)'}
                                </h3>
                                <p style={{ margin: '0 0 10px', fontSize: 11, color: PALETTE.muted }}>
                                    Numbers are from the last completed epoch ({trainJob.report.epochs_ran} epoch{trainJob.report.epochs_ran === 1 ? '' : 's'} ran).
                                    With very few training photos (like this test), these will look poor — that's expected, not a bug; accuracy improves as you
                                    annotate more real photos and re-train.
                                </p>

                                {trainJob.report.metrics.length > 0 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8, marginBottom: 14 }}>
                                        {trainJob.report.metrics.map((m) => {
                                            const displayValue = m.format === 'percent' ? `${(m.value * 100).toFixed(1)}%` : m.value.toFixed(3);
                                            return (
                                                <div key={m.label} style={{ border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 6, padding: '8px 10px', background: '#F9FAFB' }}>
                                                    <div style={{ fontSize: 10, color: PALETTE.muted, marginBottom: 2 }}>{m.label}</div>
                                                    <div style={{ fontSize: 16, fontWeight: 800 }}>{displayValue}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {trainJob.report.image_urls.length > 0 && (
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: PALETTE.muted, marginBottom: 6 }}>Charts</div>
                                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                            {trainJob.report.image_urls.map((url) => (
                                                <a key={url} href={trainingReportImageUrl(url)} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={trainingReportImageUrl(url)}
                                                        alt="training chart"
                                                        style={{ width: 220, height: 140, objectFit: 'contain', background: '#fff', border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 6 }}
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <label style={labelStyle}>Live log {trainJob.log_lines ? `(${trainJob.log_lines} lines, showing last ${trainJob.log_tail?.length || 0})` : ''}</label>
                        <pre style={{
                            background: '#0B1220', color: '#D1D5DB', borderRadius: 6, padding: 12, fontSize: 11,
                            maxHeight: 260, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0,
                        }}>
                            {(trainJob.log_tail || []).join('\n') || '(no output yet)'}
                        </pre>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AnnotationStudioPage;
