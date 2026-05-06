import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ClaimStartPage from '../pages/ClaimStart/ClaimStartPage';
import OwnerVehicleDetailsPage from '../pages/OwnerVehicleDetails/OwnerVehicleDetailsPage';
import DocumentUploadPage from '../pages/DocumentUpload/DocumentUploadPage';
import InspectionDetailsPage from '../pages/InspectionDetails/InspectionDetailsPage';
import PhotoCaptureSelectionPage from '../pages/PhotoCaptureSelection/PhotoCaptureSelectionPage';
import CameraCapturePage from '../pages/CameraCapture/CameraCapturePage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.CLAIM_START} element={<ClaimStartPage />} />
            <Route path={ROUTES.OWNER_VEHICLE_DETAILS} element={<OwnerVehicleDetailsPage />} />
            <Route path={ROUTES.DOCUMENT_UPLOAD} element={<DocumentUploadPage />} />
            <Route path={ROUTES.INSPECTION_DETAILS} element={<InspectionDetailsPage />} />
            <Route path={ROUTES.PHOTO_CAPTURE_SELECTION} element={<PhotoCaptureSelectionPage />} />
            <Route path={ROUTES.CAMERA_CAPTURE} element={<CameraCapturePage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
    );
};

export default AppRoutes;
