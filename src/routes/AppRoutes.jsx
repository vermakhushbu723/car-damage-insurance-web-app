import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ClaimStartPage from '../pages/ClaimStart/ClaimStartPage';
import OwnerVehicleDetailsPage from '../pages/OwnerVehicleDetails/OwnerVehicleDetailsPage';
import DocumentUploadPage from '../pages/DocumentUpload/DocumentUploadPage';
import InspectionDetailsPage from '../pages/InspectionDetails/InspectionDetailsPage';
import PhotoCaptureSelectionPage from '../pages/PhotoCaptureSelection/PhotoCaptureSelectionPage';
import CameraCapturePage from '../pages/CameraCapture/CameraCapturePage';
import WalkAroundVideoPage from '../pages/WalkAroundVideo/WalkAroundVideoPage';
import AddDamagePhotosPage from '../pages/AddDamagePhotos/AddDamagePhotosPage';
import AddOthersPhotosPage from '../pages/AddOthersPhotos/AddOthersPhotosPage';
import DamageReviewPage from '../pages/DamageReview/DamageReviewPage';
import SubmittedPage from '../pages/Submitted/SubmittedPage';
import ReinspectionPhotosPage from '../pages/ReinspectionPhotos/ReinspectionPhotosPage';
import VehicleInformationPage from '../pages/VehicleInformation/VehicleInformationPage';
import CustomerDeclarationPage from '../pages/CustomerDeclaration/CustomerDeclarationPage';
import InspectorDeclarationPage from '../pages/InspectorDeclaration/InspectorDeclarationPage';
import AdminLoginPage from '../pages/admin/AdminLogin/AdminLoginPage';
import AdminSelectPage from '../pages/admin/AdminSelect/AdminSelectPage';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboard/AdminDashboardPage';
import AdminClaimPage from '../pages/admin/AdminClaim/AdminClaimPage';
import AdminPlaceholderPage from '../pages/admin/AdminPlaceholder/AdminPlaceholderPage';
import AdminUserCreationPage from '../pages/admin/AdminUserCreation/AdminUserCreationPage';
import InsurerPage from '../pages/admin/Insurer/InsurerPage';
import BrokerPage from '../pages/admin/Broker/BrokerPage';
import SurveyorPage from '../pages/admin/Surveyor/SurveyorPage';
import IntimationLayout from '../pages/admin/intimation/IntimationLayout';
import IntimationPage from '../pages/admin/intimation/pages/IntimationPage';
import ClaimHandlerPage from '../pages/admin/intimation/pages/ClaimHandlerPage';
import SurveyorAppointmentPage from '../pages/admin/intimation/pages/SurveyorAppointmentPage';
import ClaimDetailsPage from '../pages/admin/intimation/pages/ClaimDetailsPage';
import ILAPage from '../pages/admin/intimation/pages/ILAPage';
import SettlementPage from '../pages/admin/intimation/pages/SettlementPage';
import FLAPage from '../pages/admin/intimation/pages/FLAPage';
import RecommendationPage from '../pages/admin/intimation/pages/RecommendationPage';
import DmsSurveyorPage from '../pages/admin/intimation/pages/DmsSurveyorPage';
import DmsPreInspectionPage from '../pages/admin/intimation/pages/DmsPreInspectionPage';
import ProtectedCameraRoute from './ProtectedCameraRoute';
import ProtectedWorkflowRoute from './ProtectedWorkflowRoute';

// Routes that don't need workflow protection
const publicRoutes = [
    { path: ROUTES.LANDING, element: <LandingPage /> },
    { path: ROUTES.CLAIM_WORKSHOP_LOGIN, element: <LoginPage /> },
    { path: ROUTES.CLAIM_SURVEYOR_LOGIN, element: <LoginPage /> },
    { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
    { path: ROUTES.CLAIM_START, element: <ClaimStartPage /> },
    { path: ROUTES.OWNER_VEHICLE_DETAILS, element: <OwnerVehicleDetailsPage /> },
    { path: ROUTES.DOCUMENT_UPLOAD, element: <DocumentUploadPage /> },
    { path: ROUTES.INSPECTION_DETAILS, element: <InspectionDetailsPage /> },
    { path: ROUTES.PHOTO_CAPTURE_SELECTION, element: <PhotoCaptureSelectionPage /> },
    { path: ROUTES.CAMERA_CAPTURE, element: <ProtectedCameraRoute element={<CameraCapturePage />} /> },
    { path: ROUTES.WALK_AROUND_VIDEO, element: <WalkAroundVideoPage /> },
    { path: ROUTES.ADD_DAMAGE_PHOTOS, element: <AddDamagePhotosPage /> },
    { path: ROUTES.CUSTOMER_DECLARATION, element: <CustomerDeclarationPage /> },
    { path: ROUTES.INSPECTOR_DECLARATION, element: <InspectorDeclarationPage /> },
];

// Routes that need workflow protection (Option Group 1)
const workflowGroup1Routes = [
    { path: ROUTES.DAMAGE_REVIEW, element: <DamageReviewPage /> },
    { path: ROUTES.SUBMITTED, element: <SubmittedPage /> },
    { path: ROUTES.REINSPECTION_PHOTOS, element: <ReinspectionPhotosPage /> },
];

// Routes that need workflow protection (Option Group 2)
const workflowGroup2Routes = [
    { path: ROUTES.ADD_OTHERS_PHOTOS, element: <AddOthersPhotosPage /> },
    { path: ROUTES.VEHICLE_INFORMATION, element: <VehicleInformationPage /> },
];

// ── Admin panel routes ─────────────────────────────────────────────────
// ROUTES.ADMIN.DASHBOARD = "/admin/dashboard" is rendered as the child
const adminLayoutChildren = [
    { path: 'dashboard', element: <AdminDashboardPage /> },
    { path: 'claim', element: <AdminClaimPage /> },
    { path: 'preinspection', element: <AdminPlaceholderPage title="Preinspection" /> },
    { path: 'settings', element: <AdminPlaceholderPage title="Settings" /> },
    { path: 'support', element: <AdminPlaceholderPage title="Support" /> },
    { path: 'user-creation', element: <AdminUserCreationPage /> },
    { path: 'insurer', element: <InsurerPage /> },
    { path: 'broker', element: <BrokerPage /> },
    { path: 'surveyor', element: <SurveyorPage /> },
    { path: 'workshop', element: <AdminPlaceholderPage title="Workshop" /> },
];

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            {publicRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* Protected workflow routes - Group 1 */}
            {workflowGroup1Routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<ProtectedWorkflowRoute element={route.element} />}
                />
            ))}

            {/* Protected workflow routes - Group 2 */}
            {workflowGroup2Routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<ProtectedWorkflowRoute element={route.element} />}
                />
            ))}

            {/* Super-Admin portal selection — shown at /admin before login */}
            <Route path={ROUTES.ADMIN.SELECT} element={<AdminSelectPage />} />

            {/* Admin login — kept outside AdminLayout so it can use its
                own full-bleed layout. */}
            <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginPage />} />

            {/* Admin panel routes (/admin/*) — shared sidebar + top bar
                via AdminLayout's <Outlet />. */}
            <Route path="/admin" element={<AdminLayout />}>
                {adminLayoutChildren.map((route) => (
                    <Route
                        key={route.path || 'admin-index'}
                        index={route.index}
                        path={route.path}
                        element={route.element}
                    />
                ))}
            </Route>

            {/* Intimation Management System (/admin/intimation/*) */}
            <Route path="/admin/intimation" element={<IntimationLayout />}>
                <Route index element={<IntimationPage />} />
                <Route path="claim-handler" element={<ClaimHandlerPage />} />
                <Route path="surveyor-appointment" element={<SurveyorAppointmentPage />} />
                <Route path="claim-details" element={<ClaimDetailsPage />} />
                <Route path="ila" element={<ILAPage />} />
                <Route path="settlement" element={<SettlementPage />} />
                <Route path="fla" element={<FLAPage />} />
                <Route path="recommendation" element={<RecommendationPage />} />
                <Route path="dms-surveyor" element={<DmsSurveyorPage />} />
                <Route path="dms-preinspection" element={<DmsPreInspectionPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
        </Routes>
    );
};

export default AppRoutes;
