import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/common/AppHeader';
import BottomButton from '../../components/common/BottomButton';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import claimFormIcon from '../../assets/icons/claim-form.svg';
import drivingLicenseIcon from '../../assets/icons/driving-license.svg';
import registrationCertificateIcon from '../../assets/icons/registration-certificate.svg';
import repairEstimateIcon from '../../assets/icons/repair-estimate.svg';
import kycIcon from '../../assets/icons/kyc.svg';
import phoneIcon from '../../assets/icons/phone.svg';

const documents = [
    {
        icon: claimFormIcon,
        label: 'Claim Form',
        iconBg: '#7C3AED',
    },
    {
        icon: drivingLicenseIcon,
        label: 'Driving License',
        iconBg: '#EF4444',
    },
    {
        icon: registrationCertificateIcon,
        label: 'Registration Certificate',
        iconBg: '#16A34A',
    },
    {
        icon: repairEstimateIcon,
        label: 'Repair Estimate',
        iconBg: '#EA580C',
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
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col" style={{ background: COLORS.bgApp }}>
            {/* Header */}
            <AppHeader />

            {/* Title Section */}
            <div className="px-6 py-2 text-center">
                <h2
                    className="text-lg font-semibold leading-snug "
                    style={{ color: COLORS.primaryDark }}
                >
                    Thank You For Reporting Motor Claim With{' '}
                    <span className="text-base leading-snug underline" style={{ color: COLORS.primaryDark }}>New India Assurance Co. Ltd.</span>
                </h2>
            </div>

            <div className="main-bg">
                {/* Info Card */}
                <div
                    className="m-4 rounded-md px-5 py-4 text-center bg-white border border-[#C5C5C5]">
                    <p className="text-md leading-relaxed" style={{ color: COLORS.textPrimary }}>
                        Before you click the "Start" button, please keep following documents handy; as essential to proceed further in survey
                    </p>
                </div>

                {/* Documents List */}
                <div className="flex-1 p-4 flex flex-col gap-4">
                    {documents.map((doc, i) => (
                        <div key={i} className="flex items-center gap-4">
                            {/* Icon Box */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: doc.iconBg + '22', border: `1.5px solid ${doc.iconBg}` }}
                            >
                                <span style={{ fontSize: 22 }}><img src={doc.icon} alt={doc.label} /></span>
                            </div>
                            {/* Label */}
                            <div className="flex-1 flex items-center">
                                <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                                    {doc.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Button */}
                <div className="px-4 py-6 mt-4">
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
