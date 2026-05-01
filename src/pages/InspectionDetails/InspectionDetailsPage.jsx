import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/common/AppHeader';
import PageTitleBar from '../../components/common/PageTitleBar';
import BottomButton from '../../components/common/BottomButton';
import RotateDeviceModal from '../../components/modals/RotateDeviceModal';
import LocationModal from '../../components/modals/LocationModal';
import { COLORS } from '../../constants/theme';

const inspectionData = [
    { icon: '🏢', label: 'Insurance Company', value: 'ABC Insurance Pvt. Ltd.', iconBg: '#3B82F6' },
    { icon: '👤', label: 'Insured Name', value: 'Rahul Sharma', iconBg: '#22C55E' },
    { icon: '🚗', label: 'Vehicle Number', value: 'MH 01 BS 1234', iconBg: '#EF4444' },
    { icon: '📋', label: 'Claim Number', value: '1234567898765MAN', iconBg: '#7C3AED' },
    { icon: '🔒', label: 'Policy Number', value: '1234 5678 9012', iconBg: '#22C55E' },
    { icon: '✉️', label: 'Email Address', value: 'rahul.sharma@email.com', iconBg: '#F97316' },
    { icon: '📱', label: 'Phone Number', value: '+91 1234567890', iconBg: '#EC4899' },
];

const instructions = [
    {
        emoji: '🔄',
        title: 'Enable Auto-Rotate',
        desc: 'Switch on auto-rotate and hold your phone horizontally to capture the full vehicle frame.',
        color: '#3B82F6',
        bg: '#EFF6FF',
    },
    {
        emoji: '📍',
        title: 'Turn On GPS Location',
        desc: 'Ensure location services are enabled to verify inspection time and location.',
        color: '#7C3AED',
        bg: '#F5F3FF',
    },
    {
        emoji: '📷',
        title: 'Capture 360° Photos',
        desc: 'Take clear photos of the front, rear, and both sides of the vehicle.',
        color: '#3B82F6',
        bg: '#EFF6FF',
    },
    {
        emoji: '📄',
        title: 'Ensure Document Clarity',
        desc: 'Place documents on a flat surface with good lighting. Avoid shadows and glare.',
        color: '#F97316',
        bg: '#FFF7ED',
    },
    {
        emoji: '🛡',
        title: 'Final Review Before Submission',
        desc: 'Double-check that all images are clear and the vehicle is fully visible.',
        color: '#7C3AED',
        bg: '#F5F3FF',
    },
];

const InspectionDetailsPage = () => {
    const navigate = useNavigate();
    const [showRotate, setShowRotate] = useState(false);
    const [showLocation, setShowLocation] = useState(false);

    const handleStartPhotos = () => {
        setShowLocation(true);
    };

    const handleLocationAllow = () => {
        setShowLocation(false);
        setShowRotate(true);
    };

    const handleRotateAllow = () => {
        setShowRotate(false);
        // Navigate to photo capture flow (future screen)
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: COLORS.bgApp }}>
            {/* Header */}
            <AppHeader />

            {/* Page Title */}
            <PageTitleBar title="Inspection Details" />

            {/* Content */}
            <div className="flex-1 px-4 pt-4 pb-6 overflow-y-auto">

                {/* Inspection Info Card */}
                <div className="bg-white rounded-2xl overflow-hidden mb-5" style={{ border: `1px solid ${COLORS.borderLight}` }}>
                    {inspectionData.map((row, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-4 py-3"
                            style={{ borderBottom: i < inspectionData.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none' }}
                        >
                            {/* Icon */}
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                                style={{ background: row.iconBg + '22', border: `1.5px solid ${row.iconBg}` }}
                            >
                                <span style={{ fontSize: 16 }}>{row.icon}</span>
                            </div>
                            {/* Label */}
                            <span className="text-sm flex-1" style={{ color: COLORS.textSecondary }}>{row.label}</span>
                            {/* Value */}
                            <span className="text-sm font-semibold text-right" style={{ color: COLORS.textPrimary, maxWidth: '55%' }}>
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Instructions Heading */}
                <p className="text-sm font-semibold mb-4" style={{ color: COLORS.textPrimary }}>
                    Please read following important instructions before you start survey
                </p>

                {/* Instructions List */}
                <div className="flex flex-col gap-3 mb-6">
                    {instructions.map((ins, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: ins.bg, border: `1.5px solid ${ins.color}22` }}
                            >
                                <span style={{ fontSize: 20 }}>{ins.emoji}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold" style={{ color: ins.color }}>{ins.title}</p>
                                <p className="text-xs leading-relaxed mt-0.5" style={{ color: COLORS.textSecondary }}>{ins.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Start Button */}
                <BottomButton label="Start Taking Photos" onClick={handleStartPhotos} />
            </div>

            {/* Modals */}
            <LocationModal visible={showLocation} onAllow={handleLocationAllow} />
            <RotateDeviceModal visible={showRotate} onAllow={handleRotateAllow} />
        </div>
    );
};

export default InspectionDetailsPage;
