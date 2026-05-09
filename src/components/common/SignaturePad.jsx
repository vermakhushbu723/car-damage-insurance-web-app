import React, { useRef, useState, useEffect, useCallback } from 'react';
import { COLORS } from '../../constants/theme';

/**
 * Canvas-based signature pad. Captures mouse + touch input, normalises
 * coordinates against the canvas bounding rect (so the stroke tracks the
 * pointer regardless of CSS scaling), and exposes the current signature
 * as a PNG data URL via `onChange` whenever a stroke ends.
 *
 * Props:
 *   value     – current signature data URL (or null). When the prop changes
 *               externally to null, the pad is cleared.
 *   onChange  – called with the PNG data URL on stroke-end, and with `null`
 *               when the user clears the pad.
 *   height    – canvas pixel height. Width fills the parent.
 *   placeholder – text shown faintly when the pad is empty.
 */
const SignaturePad = ({
    value,
    onChange,
    height = 120,
    placeholder = 'Please sign in this field',
}) => {
    const canvasRef = useRef(null);
    const drawingRef = useRef(false);
    const lastPointRef = useRef(null);
    const [isEmpty, setIsEmpty] = useState(!value);

    // Resize the canvas to its CSS box at devicePixelRatio so strokes stay
    // crisp and coordinates from getBoundingClientRect map 1:1.
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#111827';
    }, []);

    useEffect(() => {
        resizeCanvas();
        const onResize = () => {
            // Preserve the current drawing across a resize by snapshotting
            // it as a data URL, resizing, then redrawing onto the new size.
            const canvas = canvasRef.current;
            if (!canvas) return;
            const snapshot = canvas.toDataURL('image/png');
            resizeCanvas();
            const img = new Image();
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                const rect = canvas.getBoundingClientRect();
                ctx.drawImage(img, 0, 0, rect.width, rect.height);
            };
            img.src = snapshot;
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [resizeCanvas]);

    // External clear: when parent resets `value` to null, wipe the canvas.
    useEffect(() => {
        if (value === null && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            const rect = canvasRef.current.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);
            setIsEmpty(true);
        }
    }, [value]);

    const getPoint = (evt) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
        const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startStroke = (evt) => {
        evt.preventDefault();
        drawingRef.current = true;
        lastPointRef.current = getPoint(evt);
    };

    const continueStroke = (evt) => {
        if (!drawingRef.current) return;
        evt.preventDefault();
        const point = getPoint(evt);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        lastPointRef.current = point;
        if (isEmpty) setIsEmpty(false);
    };

    const endStroke = () => {
        if (!drawingRef.current) return;
        drawingRef.current = false;
        lastPointRef.current = null;
        // Emit the current signature snapshot to the parent.
        if (onChange && canvasRef.current) {
            onChange(canvasRef.current.toDataURL('image/png'));
        }
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        setIsEmpty(true);
        if (onChange) onChange(null);
    };

    return (
        <div style={{ width: '100%' }}>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height,
                    border: '1px solid #E5E7EB',
                    borderRadius: 8,
                    background: '#fff',
                    overflow: 'hidden',
                    touchAction: 'none', // prevent scroll while signing
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
                    onMouseDown={startStroke}
                    onMouseMove={continueStroke}
                    onMouseUp={endStroke}
                    onMouseLeave={endStroke}
                    onTouchStart={startStroke}
                    onTouchMove={continueStroke}
                    onTouchEnd={endStroke}
                    onTouchCancel={endStroke}
                />
                {isEmpty && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#9CA3AF',
                            fontSize: 13,
                            pointerEvents: 'none',
                            userSelect: 'none',
                        }}
                    >
                        {placeholder}
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isEmpty}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: isEmpty ? '#9CA3AF' : COLORS.primary,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: isEmpty ? 'default' : 'pointer',
                        padding: 0,
                    }}
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SignaturePad;
