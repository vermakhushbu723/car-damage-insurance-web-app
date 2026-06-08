import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ROUTES } from './routes';
import { usePageLoading } from '../../../hooks/usePageLoading';
import PageTitleBar from '../../../components/common/PageTitleBar';
import { setOption, WORKFLOW_TYPES } from '../../../store/workflowSlice';
import AppHeader from '../../../components/common/AppHeader';
import BottomButton from '../../../components/common/BottomButton';

const AddOthersPhotosPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [capturedPhotos, setCapturedPhotos] = useState({});

    // Load captured photos from localStorage
    const loadCapturedPhotos = () => {
        const stored = JSON.parse(localStorage.getItem('damage_photos') || '{}');
        setCapturedPhotos(stored);
    };

    useEffect(() => {
        loadCapturedPhotos();

        const onFocus = () => loadCapturedPhotos();
        const onVisible = () => {
            if (!document.hidden) loadCapturedPhotos();
        };

        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, []);

    const handlePhotoCapture = (photoType) => {
        sessionStorage.setItem('currentPhotoType', photoType);

        window.sessionStorage.setItem('CAMERA_ACCESS_KEY', 'true');

        navigate(`/claim-surveyor/camera-capture/${photoType}`, {
            state: {
                returnTo: '/claim-surveyor/add-others-photos',
                cameraEnabled: true,
            },
        });
    };

    const handleNext = () => {
        dispatch(setOption(WORKFLOW_TYPES.OPTION_GROUP_2));
        navigate(ROUTES.VEHICLE_INFORMATION);
    };

    const progressPercentage = 48;

    // ALL PHOTO CARDS
    const photoCards = [
        {
            key: 'dashboard',
            title: 'Dashboard',
            image: '/images/png/car/dashboard.jpg',
        },
        {
            key: 'front-side',
            title: 'Front side after opening all doors',
            image: '/images/png/car/front-view.jpg',
        },
        {
            key: 'rear-side',
            title: 'Rear side after opening all doors',
            image: '/images/png/car/rear-side.jpg',
        },
        {
            key: 'front-under-body',
            title: 'Front under body',
            image: '/images/png/car/front-under-body.jpg',
        },
        {
            key: 'windshield-front-rear',
            title: 'Front / Windshield / Rear',
            image: '/images/png/car/windshield.jpg',
        },
        {
            key: 'selfie-with-vehicle',
            title: 'Selfie along with the vehicle',
            image: '/images/png/car/selfie.jpg',
        },
        {
            key: 'open-hood',
            title: 'Open hood: Engine compartment view',
            image: '/images/png/car/open-hood.jpg',
        },
        {
            key: 'tyre-number',
            title: 'Take a close-up of the tyre numbers',
            image: '/images/png/car/tyre.jpg',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header */}
            <AppHeader />

            {/* Page Title */}
            <PageTitleBar
                title="Add Others Photos"
                onBack={() => navigate(-1)}
            />

            {/* Main Content */}
            <div className="flex-1 px-4 py-4 overflow-y-auto">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                            3 Of 7 Completed
                        </span>

                        <span className="text-sm font-medium">
                            {progressPercentage}%
                        </span>
                    </div>

                    <div className="w-full bg-blue-200 bg-opacity-30 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Photo Cards */}
                <div className="space-y-4">
                    {photoCards.map((card) => (
                        <div
                            key={card.key}
                            className="flex flex-col bg-blue-100 rounded-xl overflow-hidden p-3 gap-2"
                        >
                            {/* Title */}
                            <div>
                                <p className="text-gray-400 text-sm font-medium">
                                    {card.title}
                                </p>
                            </div>

                            {/* Image */}
                            <div className="aspect-video bg-gray-200 rounded-md overflow-hidden">
                                <img
                                    src={
                                        capturedPhotos[card.key] || card.image
                                    }
                                    alt={card.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Button */}
                            <BottomButton
                                label="Capture"
                                onClick={() => handlePhotoCapture(card.key)}
                                className="w-full py-3 font-semibold text-white transition-all rounded-md"
                                onMouseOver={(e) =>
                                    (e.target.style.opacity = '0.9')
                                }
                                onMouseOut={(e) =>
                                    (e.target.style.opacity = '1')
                                }
                            >
                                Capture
                            </BottomButton>
                        </div>
                    ))}
                </div>

                {/* Bottom Spacer */}
                <div className="h-20"></div>
            </div>

            {/* Sticky Bottom Button */}
            <div className="sticky bottom-0 left-0 right-0 px-4 py-4 bg-white bg-opacity-95">
                <BottomButton
                    label="Next"
                    onClick={handleNext}
                    disabled={false}
                />
            </div>
        </div>
    );
};

export default AddOthersPhotosPage;