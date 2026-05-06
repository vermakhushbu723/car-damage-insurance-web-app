import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppHeader from '../../components/common/AppHeader';
import PageTitleBar from '../../components/common/PageTitleBar';
import BottomButton from '../../components/common/BottomButton';
import { COLORS } from '../../constants/theme';

const CameraCapturePage = () => {
    const { angle } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState(null);

    // Format angle name for display
    const formatAngleName = (angle) => {
        return angle
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Initialize camera
    useEffect(() => {
        const startCamera = async () => {
            try {
                setError(null);

                // First, check and request camera permission using Permissions API
                if (navigator.permissions && navigator.permissions.query) {
                    try {
                        const permissionStatus = await navigator.permissions.query({ name: 'camera' });
                        
                        if (permissionStatus.state === 'denied') {
                            setError('Camera permission is blocked. Please enable camera access in your browser settings.');
                            return;
                        }
                        
                        // Listen for permission changes
                        permissionStatus.addEventListener('change', () => {
                            if (permissionStatus.state === 'denied') {
                                if (stream) {
                                    stream.getTracks().forEach(track => track.stop());
                                }
                                setError('Camera permission was revoked. Please enable it in browser settings.');
                            }
                        });
                    } catch (permErr) {
                        console.log('Permissions API not fully supported, proceeding with getUserMedia');
                    }
                }

                // Try to access device camera with landscape constraint
                const constraints = {
                    video: {
                        facingMode: 'environment', // Use rear camera
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                    audio: false,
                };

                const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                setStream(mediaStream);

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        setIsCameraReady(true);
                    };
                }
            } catch (err) {
                console.error('Error accessing camera:', err);
                
                // Provide specific error messages based on error type
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setError('Camera permission denied. Please tap "Allow" when the permission prompt appears.');
                } else if (err.name === 'NotFoundError') {
                    setError('No camera found on this device.');
                } else if (err.name === 'NotReadableError') {
                    setError('Camera is in use by another application.');
                } else if (err.name === 'SecurityError') {
                    setError('Camera access requires a secure connection (HTTPS). Please try again on a secure connection.');
                } else {
                    setError('Unable to access camera. Please check your browser permissions.');
                }
            }
        };

        startCamera();

        // Cleanup on unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Capture photo
    const handleCapturePhoto = async () => {
        if (videoRef.current && canvasRef.current) {
            setIsCapturing(true);
            try {
                const canvas = canvasRef.current;
                const video = videoRef.current;
                const context = canvas.getContext('2d');

                // Set canvas dimensions to match video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert canvas to image
                const imageData = canvas.toDataURL('image/jpeg', 0.9);
                setCapturedImage(imageData);

                // Stop the video stream
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            } catch (err) {
                console.error('Error capturing photo:', err);
                setError('Failed to capture photo');
            } finally {
                setIsCapturing(false);
            }
        }
    };

    // Retake photo
    const handleRetake = async () => {
        setCapturedImage(null);
        setIsCameraReady(false);

        try {
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    setIsCameraReady(true);
                };
            }
        } catch (err) {
            console.error('Error restarting camera:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError('Camera permission denied.');
            } else {
                setError('Unable to restart camera');
            }
        }
    };

    // Save photo and go back
    const handleSavePhoto = () => {
        // Here you would typically upload the image or save it
        console.log('Photo saved for angle:', angle);
        console.log('Image data:', capturedImage);
        navigate(-1); // Go back to photo selection
    };

    // Retry camera access
    const handleRetryCamera = async () => {
        setError(null);
        setIsCameraReady(false);
        setCapturedImage(null);

        try {
            // Request permission explicitly
            if (navigator.permissions && navigator.permissions.query) {
                try {
                    const permissionStatus = await navigator.permissions.query({ name: 'camera' });
                    if (permissionStatus.state === 'denied') {
                        setError('Camera permission is blocked. Please enable it in browser settings.');
                        return;
                    }
                } catch (permErr) {
                    console.log('Permissions API not fully supported');
                }
            }

            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    setIsCameraReady(true);
                };
            }
        } catch (err) {
            console.error('Error retrying camera:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError('Camera permission denied. Please tap "Allow" when prompted and try again.');
            } else if (err.name === 'SecurityError') {
                setError('Secure connection (HTTPS) required for camera access.');
            } else {
                setError('Unable to access camera. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-black">
            {/* Header */}
            <div className="sticky top-0 z-20">
                <AppHeader />
            </div>

            {/* Page Title */}
            <PageTitleBar title={`Capture - ${formatAngleName(angle)}`} />

            {/* Camera View */}
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-black">
                {!capturedImage ? (
                    <>
                        {/* Video Stream */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            {error && (
                                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/80">
                                    <div className="bg-white rounded-lg p-6 text-center max-w-xs mx-4">
                                        <div className="text-4xl mb-4">📷</div>
                                        <p className="text-red-600 font-bold text-lg mb-2">Camera Access Required</p>
                                        <p className="text-gray-700 text-sm mb-6">{error}</p>
                                        <div className="flex gap-3 flex-col">
                                            <button
                                                onClick={handleRetryCamera}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                                            >
                                                Try Again
                                            </button>
                                            <button
                                                onClick={() => navigate(-1)}
                                                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                                            >
                                                Go Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isCameraReady && !error && (
                                <video
                                    ref={videoRef}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    playsInline
                                />
                            )}

                            {!isCameraReady && !error && (
                                <div className="text-white text-center">
                                    <div className="animate-spin mb-4">⏳</div>
                                    <p>Initializing camera...</p>
                                </div>
                            )}

                            {/* Focus Guide Overlay */}
                            {isCameraReady && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-0 border-4 border-yellow-400" style={{ margin: '20%' }} />
                                    <p className="absolute bottom-8 left-0 right-0 text-center text-white text-sm font-semibold">
                                        Position vehicle in frame
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Capture Button */}
                        {isCameraReady && !error && (
                            <button
                                onClick={handleCapturePhoto}
                                disabled={isCapturing}
                                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50"
                                style={{ background: COLORS.btnPrimary }}
                            >
                                <span className="text-2xl">📷</span>
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        {/* Captured Image */}
                        <div className="absolute inset-0 w-full h-full">
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="w-full h-full object-contain bg-black"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute bottom-6 left-0 right-0 flex gap-4 justify-center px-4 z-10">
                            <button
                                onClick={handleRetake}
                                className="px-6 py-3 rounded-lg font-semibold text-white transition-all"
                                style={{ background: '#EF4444' }}
                            >
                                Retake
                            </button>
                            <button
                                onClick={handleSavePhoto}
                                className="px-6 py-3 rounded-lg font-semibold text-white transition-all"
                                style={{ background: COLORS.btnPrimary }}
                            >
                                Save & Continue
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Hidden Canvas for image capture */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default CameraCapturePage;
