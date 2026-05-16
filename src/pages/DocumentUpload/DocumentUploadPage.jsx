import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleFilled } from '@ant-design/icons';
import AppHeader from '../../components/common/AppHeader';
import PageTitleBar from '../../components/common/PageTitleBar';
import BottomButton from '../../components/common/BottomButton';
import DocumentCameraModal from '../../components/modals/DocumentCameraModal';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import PrimaryButton from '../../components/common/PrimaryButton';
import { usePageLoading } from '../../hooks/usePageLoading';
import SecondaryButton from '../../components/common/SecondaryButton';
import greenTickIcon from '../../assets/icons/greenTick.svg';
import pendingIcon from '../../assets/icons/pending.svg';
import claimFormIcon from '../../assets/icons/claim-form.svg';
import drivingLicenseIcon from '../../assets/icons/driving-license.svg';
import registrationCertificateIcon from '../../assets/icons/registration-certificate.svg';
import repairEstimateIcon from '../../assets/icons/repair-estimate.svg';
import kycIcon from '../../assets/icons/kyc.svg';
import phoneIcon from '../../assets/icons/phone.svg';

const DOC_LIST = [
    { id: 'claim_form', icon: claimFormIcon, bgColor: '#8A64FF40', borderColor: '#8A64FF', label: 'Claim Form', desc: 'Insurance Claim Application Form', required: true },
    { id: 'driving_license', icon: drivingLicenseIcon, bgColor: '#FF787040', borderColor: '#FF7870', label: 'Driving License', desc: 'DL Of Driver At the time of accident', required: true },
    { id: 'rc', icon: registrationCertificateIcon, bgColor: '#00934840', borderColor: '#009348', label: 'Registration Certificate', desc: 'Registration Certificate of insured vehicle', required: true },
    { id: 'repair_estimate', icon: repairEstimateIcon, bgColor: '#DB6F3740', borderColor: '#DB6F37', label: 'Repair Estimate', desc: 'Repair estimate of insured vehicle', required: false },
    { id: 'aadhar', icon: kycIcon, bgColor: '#1FA0D940', borderColor: '#1FA0D9', label: 'Aadhar Card', desc: 'Aadhar of the insured Person', required: false },
    { id: 'pan', icon: kycIcon, bgColor: '#1FA0D940', borderColor: '#1FA0D9', label: 'Pan Card', desc: 'Pan of the insured person', required: true },
    { id: 'others', icon: phoneIcon, bgColor: '#01A0FE40', borderColor: '#01A0FE', label: 'Others', desc: 'PUC, Fitness, Police papers & any other documents required in support of claim', required: false },
];

const DocumentUploadPage = () => {
    usePageLoading();
    const navigate = useNavigate();
    const [uploaded, setUploaded] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [activeDoc, setActiveDoc] = useState(null);
    const [pickerSource, setPickerSource] = useState('camera'); // 'camera' | 'gallery'

    const completedCount = Object.keys(uploaded).filter((k) => uploaded[k]).length;
    const totalCount = DOC_LIST.length;
    const requiredCount = DOC_LIST.filter((d) => d.required).length;
    const optionalCount = DOC_LIST.filter((d) => !d.required).length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    const openModal = (doc, source) => {
        setActiveDoc(doc);
        setPickerSource(source);
        setModalVisible(true);
    };

    const handleCapture = (side, file) => {
        if (activeDoc) {
            setUploaded((p) => ({
                ...p,
                [activeDoc.id]: {
                    ...(typeof p[activeDoc.id] === 'object' ? p[activeDoc.id] : {}),
                    [side]: file || true,
                },
            }));
        }
        setModalVisible(false);
    };

    const handleNext = () => {
        navigate(ROUTES.INSPECTION_DETAILS);
    };

    return (
        <div className="min-h-screen flex flex-col" >
            {/* Header */}
            <AppHeader />

            {/* Page Title */}
            <PageTitleBar title="Document Upload" subtitle="Upload All Required Documents" />

            <div className="bg-white">
                {/* Upload Progress */}
                <div className="mx-4 mt-4 rounded-2xl p-4 main-bg">
                    <p className="text-sm font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Upload Progress</p>
                    <div className="w-full h-2 rounded-full mb-2 overflow-hidden" style={{ background: '#E2E8F0' }}>
                        <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${progressPercent}%`, background: COLORS.primary }}
                        />
                    </div>
                    <p className="text-xs" style={{ color: COLORS.textPrimary }}>
                        {completedCount} Of {totalCount} Completed
                    </p>
                    <p className="text-xs" style={{ color: COLORS.textPrimary }}>
                        {requiredCount} Required {optionalCount} Optional
                    </p>
                </div>

                {/* Document Cards */}
                <div className="flex-1 px-4 mt-4 pb-6 flex flex-col gap-3">
                    {DOC_LIST.map((doc) => {
                        const isDone = !!uploaded[doc.id];
                        return (
                            <div
                                key={doc.id}
                                className="main-bg rounded-2xl p-3" >
                                {/* Doc Title Row */}
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded border flex items-center justify-center" style={{ borderColor: doc.borderColor, backgroundColor: doc.bgColor }}>
                                            <img src={doc.icon} alt={doc.label} className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{doc.label}</span>
                                        {doc.required ? (
                                            <img src={greenTickIcon} alt="submited" className="w-5 h-5" />
                                        ) : (
                                            <img src={pendingIcon} alt="pending" className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span
                                        className="text-xs px-2 py-0.5 rounded-full border"
                                        style={{
                                            color: doc.required ? COLORS.textGreen : COLORS.statusPending,
                                            borderColor: doc.required ? COLORS.statusCompleted : doc.statusCompleted,
                                            backgroundColor: doc.required ? COLORS.statusCompleted + '20' : COLORS.statusPending + '20',
                                        }}
                                    >
                                        {doc.required ? 'Submited' : 'pending'}
                                    </span>
                                </div>
                                <p className="text-xs mb-3 ml-7" style={{ color: COLORS.textPrimary }}>{doc.desc}</p>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <PrimaryButton
                                        label='Camera'
                                        onClick={() => openModal(doc, 'camera')}
                                        className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
                                        style={{ width: '181px', height: '37px', }}
                                    />
                                    <SecondaryButton
                                        label='Gallery'
                                        onClick={() => openModal(doc, 'gallery')}
                                        // className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
                                        style={{ width: '181px', height: '37px', }}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    <BottomButton label="Next" onClick={handleNext} />
                </div>

                {/* Document Camera Modal */}
                <DocumentCameraModal
                    visible={modalVisible}
                    docName={activeDoc?.label}
                    source={pickerSource}
                    onClose={() => setModalVisible(false)}
                    onCapture={handleCapture}
                />
            </div>
        </div>
    );
};

export default DocumentUploadPage;
