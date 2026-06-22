import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ROUTES } from './routes';
import { usePageLoading } from '../../../../hooks/usePageLoading';
import PageTitleBar from '../../../../components/common/PageTitleBar';
import { setOption, WORKFLOW_TYPES } from '../../../../store/workflowSlice';
import AppHeader from '../../../../components/common/AppHeader';
import BottomButton from '../../../../components/common/BottomButton';
import bgDashboard from '../../../../assets/instruction-bg/Dashboard.jpg';
import bgFrontDoors from '../../../../assets/instruction-bg/Front-side-after-opening-all-doors.png';
import bgRearDoors from '../../../../assets/instruction-bg/Rear-side-after-opening-all-doors.png';
import bgFrontUnderBody from '../../../../assets/instruction-bg/Front-under-body.png';
import bgWindshield from '../../../../assets/instruction-bg/WINDSHIELD1.png';
import bgWindshield2 from '../../../../assets/instruction-bg/WINDSHIELD2.png';
import bgSelfie from '../../../../assets/instruction-bg/Selfie-along-with-the-veichle.jpg';
import bgOpenHood from '../../../../assets/instruction-bg/Open-hood.png';
import bgTyre from '../../../../assets/instruction-bg/tyre.png';

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

    // Next empty sub-slot for a card (windshield has 2, tyre has 4).
    const nextSlotKey = (card) => {
        const empty = card.slots.find((s) => !capturedPhotos[s.key]);
        return (empty || card.slots[card.slots.length - 1]).key;
    };

    // ALL PHOTO CARDS
    const photoCards = [
        { key: 'dashboard', title: 'Dashboard', slots: [{ key: 'dashboard', bg: bgDashboard }] },
        { key: 'front-side', title: 'Front side after opening all doors', slots: [{ key: 'others-front-side', bg: bgFrontDoors }] },
        { key: 'rear-side', title: 'Rear side after opening all doors', slots: [{ key: 'others-rear-side', bg: bgRearDoors }] },
        { key: 'front-under-body', title: 'Front under body', slots: [{ key: 'front-under-body', bg: bgFrontUnderBody }] },
        { key: 'windshield-front-rear', title: 'Front / Windshield / Rear', slots: [{ key: 'windshield-front', bg: bgWindshield }, { key: 'windshield-rear', bg: bgWindshield2 }] },
        { key: 'selfie-with-vehicle', title: 'Selfie along with the vehicle', slots: [{ key: 'selfie-with-vehicle', bg: bgSelfie }] },
        { key: 'open-hood', title: 'Open hood: Engine compartment view', slots: [{ key: 'open-hood', bg: bgOpenHood }] },
        { key: 'tyre-number', title: 'Take a close-up of the tyre numbers', slots: [{ key: 'tyre-1', bg: bgTyre }, { key: 'tyre-2', bg: bgTyre }, { key: 'tyre-3', bg: bgTyre }, { key: 'tyre-4', bg: bgTyre }] },
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
                    {photoCards.map((card) => {
                        const multi = card.slots.length > 1;
                        return (
                            <div
                                key={card.key}
                                className="flex flex-col bg-blue-100 rounded-xl overflow-hidden p-3 gap-2"
                            >
                                <p className="text-gray-400 text-sm font-medium">
                                    {card.title}
                                </p>

                                {/* Sub-slots: instruction guide at low opacity until the
                                    user captures that photo. Tap a slot to (re)capture it. */}
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {card.slots.map((slot) => (
                                        <div
                                            key={slot.key}
                                            onClick={() => handlePhotoCapture(slot.key)}
                                            className="bg-gray-200 rounded-md overflow-hidden"
                                            style={{ flex: 1, aspectRatio: multi ? '1 / 1' : '16 / 9', cursor: 'pointer' }}
                                        >
                                            <img
                                                src={capturedPhotos[slot.key] || slot.bg}
                                                alt={card.title}
                                                className="w-full h-full object-cover"
                                                style={capturedPhotos[slot.key] ? undefined : { opacity: 0.4 }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <BottomButton
                                    label="Capture"
                                    onClick={() => handlePhotoCapture(nextSlotKey(card))}
                                    className="w-full py-3 font-semibold text-white transition-all rounded-md"
                                >
                                    Capture
                                </BottomButton>
                            </div>
                        );
                    })}
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