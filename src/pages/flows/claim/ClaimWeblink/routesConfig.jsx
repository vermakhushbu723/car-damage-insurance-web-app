import React from 'react';
import ProtectedCameraRoute from '../../../../routes/ProtectedCameraRoute';
import { ROUTES } from './routes';
import { Navigate } from 'react-router-dom';
import { isSurveySubmitted } from '../../../../services/surveyLinkApi';

/** Survey link already submitted: the form pages go back to the start page ("Form Already Submitted"). */
const SurveyGuard = ({ element }) => (isSurveySubmitted() ? <Navigate to={ROUTES.CLAIM_START} replace /> : element);
const OPEN = [ROUTES.LOGIN, ROUTES.DASHBOARD, ROUTES.CLAIM_START, ROUTES.SUBMITTED];
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import ClaimStartPage from './ClaimStartPage';
import OwnerVehicleDetailsPage from './OwnerVehicleDetailsPage';
import DocumentUploadPage from './DocumentUploadPage';
import InspectionDetailsPage from './InspectionDetailsPage';
import PhotoCaptureSelectionPage from './PhotoCaptureSelectionPage';
import CameraCapturePage from './CameraCapturePage';
import WalkAroundVideoPage from './WalkAroundVideoPage';
import AddDamagePhotosPage from './AddDamagePhotosPage';
import AddOthersPhotosPage from './AddOthersPhotosPage';
import DamageReviewPage from './DamageReviewPage';
import SubmittedPage from './SubmittedPage';
import ReinspectionPhotosPage from './ReinspectionPhotosPage';
import RepairSubmissionPage from './RepairSubmissionPage';
import VehicleInformationPage from './VehicleInformationPage';
import CustomerDeclarationPage from './CustomerDeclarationPage';
import InspectorDeclarationPage from './InspectorDeclarationPage';

const routes = [
    { path: ROUTES.LOGIN, element: <LoginPage /> },
    { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
    { path: ROUTES.CLAIM_START, element: <ClaimStartPage /> },
    { path: ROUTES.OWNER_VEHICLE_DETAILS, element: <OwnerVehicleDetailsPage /> },
    { path: ROUTES.DOCUMENT_UPLOAD, element: <DocumentUploadPage /> },
    { path: ROUTES.INSPECTION_DETAILS, element: <InspectionDetailsPage /> },
    { path: ROUTES.PHOTO_CAPTURE_SELECTION, element: <PhotoCaptureSelectionPage /> },
    { path: ROUTES.CAMERA_CAPTURE, element: <ProtectedCameraRoute element={<CameraCapturePage />} /> },
    { path: ROUTES.WALK_AROUND_VIDEO, element: <WalkAroundVideoPage /> },
    { path: ROUTES.ADD_DAMAGE_PHOTOS, element: <AddDamagePhotosPage /> },
    { path: ROUTES.ADD_OTHERS_PHOTOS, element: <AddOthersPhotosPage /> },
    { path: ROUTES.DAMAGE_REVIEW, element: <DamageReviewPage /> },
    { path: ROUTES.SUBMITTED, element: <SubmittedPage /> },
    { path: ROUTES.REINSPECTION_PHOTOS, element: <ReinspectionPhotosPage /> },
    { path: ROUTES.REPAIR_SUBMISSION, element: <RepairSubmissionPage /> },
    { path: ROUTES.VEHICLE_INFORMATION, element: <VehicleInformationPage /> },
    { path: ROUTES.CUSTOMER_DECLARATION, element: <CustomerDeclarationPage /> },
    { path: ROUTES.INSPECTOR_DECLARATION, element: <InspectorDeclarationPage /> },
];

// Route list for this flow — spread into AppRoutes.
export const flowRoutes = routes.map((r) => (OPEN.includes(r.path) ? r : { ...r, element: <SurveyGuard element={r.element} /> }));

export default flowRoutes;
