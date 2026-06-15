import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../../components/common/AppHeader';
import BottomButton from '../../../../components/common/BottomButton';
import { COLORS } from '../../../../constants/theme';
import { ROUTES } from './routes';
import { usePageLoading } from '../../../../hooks/usePageLoading';
import claimFormIcon from '../../../../assets/icons/claim-form.svg';
import drivingLicenseIcon from '../../../../assets/icons/driving-license.svg';
import registrationCertificateIcon from '../../../../assets/icons/registration-certificate.svg';
import kycIcon from '../../../../assets/icons/kyc.svg';
import phoneIcon from '../../../../assets/icons/phone.svg';

// Preinspection variant of the claim-start "keep documents handy" screen.
// Same layout as the claim flow, but with the risk-inspection wording and
// the preinspection document checklist (policy copy, PUC, RC, KYC).
const documents = [
    {
        icon: claimFormIcon,
        label: 'Previous policy copy',
        iconBg: '#7C3AED',
    },
    {
        icon: drivingLicenseIcon,
        label: 'PUC',
        iconBg: '#EF4444',
    },
    {
        icon: registrationCertificateIcon,
        label: 'Registration Certificate',
        iconBg: '#16A34A',
    },
    {
        icon: kycIcon,
        label: 'KYC ( Aadhar & PAN Card )',
        iconBg: '#0EA5E9',
    },
    {
        icon: phoneIcon,
        label: 'If You Need Any Help Please Contact Our Toll Free Number @ +91 1234567890',
        iconBg: '#0EA5E9',
        isHelp: true,
    },
];

const ClaimStartPage = () => {
    usePageLoading();
    const navigate = useNavigate();

    return (
        <div
            className="h-dvh flex flex-col overflow-hidden"
            style={{ background: COLORS.bgApp }}
        >
            {/* Header */}
            <div className="shrink-0">
                <AppHeader />
            </div>

            {/* Title Section — white text on the blue header band */}
            <div className="px-4 py-2 text-center shrink-0">
                <h2
                    className="text-base font-bold leading-snug"
                    style={{ color: COLORS.textWhite }}
                >
                    Thank you for using risk inspection services
                </h2>
            </div>

            {/* Main content card — fills remaining height, no scroll */}
            <div className="flex-1 min-h-0 flex flex-col main-bg overflow-hidden">
                {/* Info Card */}
                <div
                    className="mx-3 mt-3 mb-2 rounded-md px-4 py-2 text-center bg-white border border-[#C5C5C5] shrink-0"
                >
                    <p
                        className="text-sm leading-snug"
                        style={{ color: COLORS.textPrimary }}
                    >
                        Before you click the "Start" button, please keep following documents handy; as essential to proceed further in survey
                    </p>
                </div>

                {/* Documents List — flex-1 so it shares remaining space */}
                <div className="flex-1 min-h-0 px-4 py-1 flex flex-col gap-5 overflow-hidden">
                    {documents.map((doc, i) => (
                        <div key={i} className="flex items-center gap-3">
                            {/* Icon Box */}
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: doc.iconBg + '22', border: `1.5px solid ${doc.iconBg}` }}
                            >
                                <img src={doc.icon} alt={doc.label} className="w-5 h-5" />
                            </div>
                            {/* Label */}
                            <div className="flex-1 flex items-center">
                                <p
                                    className="text-sm font-medium leading-snug"
                                    style={{ color: COLORS.textPrimary }}
                                >
                                    {doc.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Button */}
                <div className="px-4 py-3 shrink-0">
                    <BottomButton
                        label="Start"
                        onClick={() => navigate(ROUTES.OWNER_VEHICLE_DETAILS)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ClaimStartPage;
