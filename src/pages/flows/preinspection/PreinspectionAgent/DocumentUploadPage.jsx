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
import claimFormIcon from '../../../../assets/icons/claim-form.svg';
import repairEstimateIcon from '../../../../assets/icons/repair-estimate.svg';
import registrationCertificateIcon from '../../../../assets/icons/registration-certificate.svg';
import kycIcon from '../../../../assets/icons/kyc.svg';
import phoneIcon from '../../../../assets/icons/phone.svg';

// Preinspection document checklist. Doc-type icons are reused from the claim
// flow's document-upload screen:
//   Previous policy copy → Claim Form icon
//   PUC                  → Repair Estimate icon
const DOC_LIST = [
    { id: 'policy_copy', icon: claimFormIcon, bgColor: '#8A64FF40', borderColor: '#8A64FF', label: 'Previous policy copy', desc: 'Insurance Claim Application Form', required: true },
    { id: 'puc', icon: repairEstimateIcon, bgColor: '#DB6F3740', borderColor: '#DB6F37', label: 'PUC', desc: 'DL Of Driver At the time of accident', required: true },
    { id: 'rc', icon: registrationCertificateIcon, bgColor: '#00934840', borderColor: '#009348', label: 'Registration Certificate', desc: 'Registration Certificate of insured vehicle', required: true, frontBack: true },
    { id: 'aadhar', icon: kycIcon, bgColor: '#1FA0D940', borderColor: '#1FA0D9', label: 'Aadhar Card', desc: 'Aadhar of the insured Person', required: true, frontBack: true },
    { id: 'pan', icon: kycIcon, bgColor: '#1FA0D940', borderColor: '#1FA0D9', label: 'Pan Card', desc: 'Pan of the insured person', required: true, frontBack: true },
    { id: 'others', icon: phoneIcon, bgColor: '#01A0FE40', borderColor: '#01A0FE', label: 'Others', desc: 'PUC, Fitness,Police papers & any other documents required in support of claim', required: true, isOther: true },
];

// Which modal layout each document uses:
//   isOther   → 'other'     (multiple images + editable name)
//   frontBack → 'frontBack' (Front Side / Back Side — Reg. Certificate, Aadhar, PAN)
//   otherwise → 'multiple'  (multiple images, fixed name)
const docModeFor = (doc) => (doc?.isOther ? 'other' : doc?.frontBack ? 'frontBack' : 'multiple');

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

    // Multi-image save. 'Other' accumulates a list of named documents (the card
    // lists their names); a fixed-name multi doc just keeps its latest images.
    const handleSaveOther = (name, files) => {
        if (!activeDoc) return;
        const urls = files.map((f) => URL.createObjectURL(f));
        const label = name || activeDoc.label;
        setUploaded((p) => {
            if (activeDoc.isOther) {
                const prevDocs = p[activeDoc.id]?.documents || [];
                const documents = [...prevDocs, { name: label, urls, count: files.length }];
                return { ...p, [activeDoc.id]: { documents, count: documents.length } };
            }
            return { ...p, [activeDoc.id]: { name: label, files, urls, count: files.length } };
        });
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
                                        <div className="w-8 h-8 rounded border flex items-center justify-center shrink-0" style={{ borderColor: doc.borderColor, backgroundColor: doc.bgColor }}>
                                            <img src={doc.icon} alt={doc.label} className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>{doc.label}</span>
                                        <img
                                            src={isDone || doc.required ? greenTickIcon : pendingIcon}
                                            alt={isDone || doc.required ? 'submitted' : 'pending'}
                                            className="w-5 h-5 shrink-0"
                                        />
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
                                <p className="text-sm mb-3 ml-10" style={{ color: COLORS.textPrimary }}>{doc.desc}</p>

                                {/* Others → list of entered document names. */}
                                {doc.isOther && uploaded[doc.id]?.documents?.length > 0 ? (
                                    <div className="flex flex-col gap-1 mb-3 ml-10">
                                        {uploaded[doc.id].documents.map((d, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLORS.primary }} />
                                                <span className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>{d.name}</span>
                                                <span className="text-xs" style={{ color: COLORS.textSecondary }}>({d.count} image{d.count !== 1 ? 's' : ''})</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}

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
                    mode={docModeFor(activeDoc)}
                    onClose={() => setModalVisible(false)}
                    onCapture={handleCapture}
                    onSaveOther={handleSaveOther}
                />
            </div>
        </div>
    );
};

export default DocumentUploadPage;
