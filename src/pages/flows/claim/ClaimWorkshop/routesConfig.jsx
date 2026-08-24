import React from 'react';
import ProtectedCameraRoute from '../../../../routes/ProtectedCameraRoute';
import RequireAuth from '../../../../routes/RequireAuth';
import { ROUTES } from './routes';
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

// Must match the role this flow logs into (see LoginPage.jsx's PORTAL_ROLE
// and ai-damage-assessment-service/auth-service/src/schemas/roles.js).
const PORTAL_ROLE = 'claim_workshop';

// Raw route list for this flow, before the auth guard is applied.
const rawFlowRoutes = [
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

// Every route except LOGIN itself requires a valid claim_workshop session --
// hitting any of these URLs directly without logging in first bounces back
// to ROUTES.LOGIN (see RequireAuth). Spread into AppRoutes.
export const flowRoutes = rawFlowRoutes.map((route) =>
    route.path === ROUTES.LOGIN
        ? route
        : { ...route, element: <RequireAuth role={PORTAL_ROLE} loginPath={ROUTES.LOGIN}>{route.element}</RequireAuth> }
);

export default flowRoutes;
