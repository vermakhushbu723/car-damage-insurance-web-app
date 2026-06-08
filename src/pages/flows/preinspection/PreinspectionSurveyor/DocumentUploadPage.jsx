import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../../../components/common/AppHeader';
import PageTitleBar from '../../../../components/common/PageTitleBar';
import BottomButton from '../../../../components/common/BottomButton';
import DocumentCameraModal from '../../../../components/modals/DocumentCameraModal';
import { COLORS } from '../../../../constants/theme';
import { ROUTES } from './routes';
import PrimaryButton from '../../../../components/common/PrimaryButton';
import { usePageLoading } from '../../../../hooks/usePageLoading';
import SecondaryButton from '../../../../components/common/SecondaryButton';
import greenTickIcon from '../../../../assets/icons/greenTick.svg';
import pendingIcon from '../../../../assets/icons/pending.svg';

// Preinspection document checklist — same upload UX as the claim flow, but
// preinspection-specific documents. Each card shows a live status icon
// (green tick once uploaded, pending dots otherwise) and a Required/Optional
// pill on the right.
const DOC_LIST = [
    { id: 'policy_copy', label: 'Previous policy copy', desc: 'Insurance Claim Application Form', required: true },
    { id: 'puc', label: 'PUC', desc: 'DL Of Driver At the time of accident', required: true },
    { id: 'rc', label: 'Registration Certificate', desc: 'Registration Certificate of insured vehicle', required: true },
    { id: 'aadhar', label: 'Aadhar Card', desc: 'Aadhar of the insured Person', required: true },
    { id: 'pan', label: 'Pan Card', desc: 'Pan of the insured person', required: true },
    { id: 'others', label: 'Others', desc: 'PUC, Fitness,Police papers & any other documents required in support of claim', required: true },
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
                    <p className="text-sm" style={{ color: COLORS.textPrimary }}>
                        {completedCount} Of {totalCount} Completed
                    </p>
                    <p className="text-sm" style={{ color: COLORS.textPrimary }}>
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
                                        <img
                                            src={isDone ? greenTickIcon : pendingIcon}
                                            alt={isDone ? 'uploaded' : 'pending'}
                                            className="w-6 h-6 shrink-0"
                                        />
                                        <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{doc.label}</span>
                                    </div>
                                    <span
                                        className="text-sm px-3 py-0.5 rounded-full border"
                                        style={{
                                            color: doc.required ? COLORS.statusPending : COLORS.textSecondary,
                                            borderColor: doc.required ? COLORS.statusPending : COLORS.textSecondary,
                                            backgroundColor: (doc.required ? COLORS.statusPending : COLORS.textSecondary) + '20',
                                        }}
                                    >
                                        {doc.required ? 'Required' : 'Optional'}
                                    </span>
                                </div>
                                <p className="text-sm mb-3 ml-8" style={{ color: COLORS.textPrimary }}>{doc.desc}</p>

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
