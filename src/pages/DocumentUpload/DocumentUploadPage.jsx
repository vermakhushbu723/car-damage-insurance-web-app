import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleFilled } from '@ant-design/icons';
import AppHeader from '../../components/common/AppHeader';
import PageTitleBar from '../../components/common/PageTitleBar';
import BottomButton from '../../components/common/BottomButton';
import DocumentCameraModal from '../../components/modals/DocumentCameraModal';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';

const DOC_LIST = [
    { id: 'claim_form', label: 'Claim Form', desc: 'Insurance Claim Application Form', required: true },
    { id: 'driving_license', label: 'Driving License', desc: 'DL Of Driver At the time of accident', required: true },
    { id: 'rc', label: 'Registration Certificate', desc: 'Registration Certificate of insured vehicle', required: true },
    { id: 'repair_estimate', label: 'Repair Estimate', desc: 'Repair estimate of insured vehicle', required: true },
    { id: 'aadhar', label: 'Aadhar Card', desc: 'Aadhar of the insured Person', required: true },
    { id: 'pan', label: 'Pan Card', desc: 'Pan of the insured person', required: true },
    { id: 'others', label: 'Others', desc: 'PUC, Fitness, Police papers & any other documents required in support of claim', required: false },
];

const DocumentUploadPage = () => {
    const navigate = useNavigate();
    const [uploaded, setUploaded] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [activeDoc, setActiveDoc] = useState(null);

    const completedCount = Object.keys(uploaded).filter((k) => uploaded[k]).length;
    const totalCount = DOC_LIST.length;
    const requiredCount = DOC_LIST.filter((d) => d.required).length;
    const optionalCount = DOC_LIST.filter((d) => !d.required).length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    const openModal = (doc) => {
        setActiveDoc(doc);
        setModalVisible(true);
    };

    const handleCapture = () => {
        if (activeDoc) {
            setUploaded((p) => ({ ...p, [activeDoc.id]: true }));
        }
        setModalVisible(false);
    };

    const handleNext = () => {
        navigate(ROUTES.INSPECTION_DETAILS);
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: COLORS.bgApp }}>
            {/* Header */}
            <AppHeader />

            {/* Page Title */}
            <PageTitleBar title="Document Upload" />
            <p className="text-center text-xs font-medium py-1" style={{ color: COLORS.textWhite, background: COLORS.primaryDark }}>
                Upload All Required Documents
            </p>

            {/* Upload Progress */}
            <div className="mx-4 mt-4 rounded-2xl p-4 bg-white">
                <p className="text-sm font-semibold mb-2" style={{ color: COLORS.textPrimary }}>Upload Progress</p>
                <div className="w-full h-2 rounded-full mb-2 overflow-hidden" style={{ background: '#E2E8F0' }}>
                    <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${progressPercent}%`, background: COLORS.primary }}
                    />
                </div>
                <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                    {completedCount} Of {totalCount} Completed
                </p>
                <p className="text-xs" style={{ color: COLORS.textSecondary }}>
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
                            className="bg-white rounded-2xl p-4"
                            style={{ border: `1px solid ${COLORS.borderLight}` }}
                        >
                            {/* Doc Title Row */}
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    {isDone
                                        ? <CheckCircleFilled style={{ color: COLORS.statusCompleted, fontSize: 20 }} />
                                        : <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: COLORS.borderInput }}>
                                            <span style={{ fontSize: 10, color: COLORS.textSecondary }}>+</span>
                                        </div>
                                    }
                                    <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{doc.label}</span>
                                </div>
                                <span
                                    className="text-xs px-2 py-0.5 rounded-full border"
                                    style={{
                                        color: doc.required ? COLORS.statusPending : COLORS.textSecondary,
                                        borderColor: doc.required ? COLORS.statusPending : COLORS.borderInput,
                                    }}
                                >
                                    {doc.required ? 'Required' : 'Optional'}
                                </span>
                            </div>
                            <p className="text-xs mb-3 ml-7" style={{ color: COLORS.textSecondary }}>{doc.desc}</p>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => openModal(doc)}
                                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
                                    style={{ background: COLORS.btnCamera }}
                                >
                                    Camera
                                </button>
                                <button
                                    onClick={() => openModal(doc)}
                                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
                                    style={{ background: COLORS.btnGallery }}
                                >
                                    Gallery
                                </button>
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
                onClose={() => setModalVisible(false)}
                onCapture={handleCapture}
            />
        </div>
    );
};

export default DocumentUploadPage;
