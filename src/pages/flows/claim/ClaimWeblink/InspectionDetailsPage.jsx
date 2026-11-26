import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../../components/common/AppHeader';
import PageTitleBar from '../../../../components/common/PageTitleBar';
import BottomButton from '../../../../components/common/BottomButton';
import RotateDeviceModal from '../../../../components/modals/RotateDeviceModal';
import LocationModal from '../../../../components/modals/LocationModal';
import { COLORS } from '../../../../constants/theme';
import { ROUTES } from './routes';
import { usePageLoading } from '../../../../hooks/usePageLoading';
import { getCachedSurveyClaim } from '../../../../services/surveyLinkApi';
import insuranceCompanyIcon from '../../../../assets/icons/InsuranceCompany.svg';
import greenInsuredNameIcon from '../../../../assets/icons/GreenInsuredName.svg';
import vehicleNumberIcon from '../../../../assets/icons/VehicleNumber.svg';
import purpleClaimNumberIcon from '../../../../assets/icons/PurpleClaimNumber.svg';
import policyNumberIcon from '../../../../assets/icons/PolicyNumber.svg';
import emailAddressIcon from '../../../../assets/icons/EmailAddress.svg';
import phoneNumberIcon from '../../../../assets/icons/PhoneNumber.svg';
import autorateIcon from '../../../../assets/icons/autorate.svg';
import gpsLocationIcon from '../../../../assets/icons/gpslocation.svg';
import photos360Icon from '../../../../assets/icons/photos360.svg';
import documentClarityIcon from '../../../../assets/icons/documentclarity.svg';
import finalReviewIcon from '../../../../assets/icons/finalreview.svg';

/** This claim's details (survey link); '-' when the call center did not enter them. */
const readOwner = () => {
    try {
        return JSON.parse(sessionStorage.getItem('ownerVehicleDetails') || '{}');
    } catch {
        return {};
    }
};
const claimData = () => {
    const c = getCachedSurveyClaim() ?? {};
    const o = readOwner();
    return [
        { icon: insuranceCompanyIcon, label: 'Insurance Company', value: c.insurer?.name || '-', iconBg: '#3B82F6' },
        { icon: greenInsuredNameIcon, label: 'Insured Name', value: o.ownerName || c.insured?.name || '-', iconBg: '#22C55E' },
        { icon: vehicleNumberIcon, label: 'Vehicle Number', value: o.registrationNumber || c.vehicle?.registrationNumber || '-', iconBg: '#EF4444' },
        { icon: purpleClaimNumberIcon, label: 'Claim Number', value: c.insurer?.claimNumber || c.claimNo || '-', iconBg: '#7C3AED' },
        { icon: policyNumberIcon, label: 'Policy Number', value: c.insurer?.policyNumber || '-', iconBg: '#16A34A' },
    ];
};


const instructions = [
    {
        emoji: autorateIcon,
        title: 'Enable Auto-Rotate',
        desc: 'Switch on auto-rotate and hold your phone horizontally to capture the full vehicle frame.',
        color: '#00E4DF',
        bg: '#00E4DF40',
    },
    {
        emoji: gpsLocationIcon,
        title: 'Turn On GPS Location',
        desc: 'Ensure location services are enabled to verify inspection time and location.',
        color: '#7532FC',
        bg: '#7532FC40',
    },
    {
        emoji: photos360Icon,
        title: 'Capture 360° Photos',
        desc: 'Take clear photos of the front, rear, and both sides of the vehicle.',
        color: '#01A0FE',
        bg: '#00A7F840',
    },
    {
        emoji: documentClarityIcon,
        title: 'Ensure Document Clarity',
        desc: 'Place documents on a flat surface with good lighting. Avoid shadows and glare.',
        color: '#FF8427',
        bg: '#FF842740',
    },
    {
        emoji: finalReviewIcon,
        title: 'Final Review Before Submission',
        desc: 'Double-check that all images are clear and the vehicle is fully visible.',
        color: '#FF1578',
        bg: '#FF157840',
    },
];

const InspectionDetailsPage = () => {
    usePageLoading();
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
        navigate(ROUTES.PHOTO_CAPTURE_SELECTION);
    };

    return (
        <div className="min-h-screen flex flex-col main-bg">
            {/* Header */}
            <AppHeader />

            {/* Page Title */}
            <PageTitleBar title="Inspection Details" />

            {/* Content — scrolls naturally so every row stays readable */}
            <div className="flex-1 px-4 pt-4 pb-6 main-bg">

                {/* Inspection Info Card */}
                <div
                    className="bg-white rounded-2xl px-4 mb-4"
                    style={{ border: `1px solid ${COLORS.borderInput}`, boxShadow: '0px 1px 6px 0px #00000026' }}
                >
                    {claimData().map((row, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 py-2"
                            style={{ borderBottom: i < 4 ? `1px solid ${COLORS.borderInput}` : 'none' }}
                        >
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                style={{ background: row.iconBg + '22', border: `1.5px solid ${row.iconBg}` }}
                            >
                                <img src={row.icon} alt={row.label} className="w-5 h-5" />
                            </div>
                            <span className="text-sm w-32 font-semibold leading-snug shrink-0" style={{ color: COLORS.textPrimary }}>
                                {row.label}
                            </span>
                            <span className="text-sm font-medium flex-1 leading-snug break-words" style={{ color: COLORS.textPrimary }}>
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Instructions Heading */}
                <p
                    className="text-sm font-semibold mb-2 leading-snug"
                    style={{ color: COLORS.textPrimary }}
                >
                    Please read following important instructions before you start survey
                </p>

                {/* Instructions List */}
                <div className="flex flex-col gap-3 mb-5">
                    {instructions.map((ins, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div
                                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                                style={{ background: ins.bg, border: `1.5px solid ${ins.color}` }}
                            >
                                <img src={ins.emoji} alt={ins.title} className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold leading-tight" style={{ color: ins.color }}>
                                    {ins.title}
                                </p>
                                <p className="text-xs leading-snug mt-0.5" style={{ color: COLORS.textSecondary }}>
                                    {ins.desc}
                                </p>
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
