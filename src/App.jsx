import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import UserLogin from "./pages/UserLogin";
import { SuperAdminDashboard, AdminDashboard, UserDashboard, SuperAdminDashboardUsers, SuperAdminDashboardProducts, SuperAdminDashboardCategories, SuperAdminDashboardSuppliers, SuperAdminDashboardRoles } from "./pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<Navigate to="/UserLogin" replace />} />
                <Route path="/UserLogin" element={<UserLogin />} />
                
                <Route path="/UserDashboard" element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <UserDashboard />
                    </ProtectedRoute>
                } />
                
                <Route path="/AdminDashboard" element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                
                <Route path="/SuperAdminDashboard" element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                        <SuperAdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/SuperAdminDashboard/User" element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                        <SuperAdminDashboardUsers />
                    </ProtectedRoute>
                } />
                <Route path="/SuperAdminDashboard/Products" element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                        <SuperAdminDashboardProducts />
                    </ProtectedRoute>
                } />
                <Route path="/SuperAdminDashboard/Categories" element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                        <SuperAdminDashboardCategories />
                    </ProtectedRoute>
                } />
                <Route path="/SuperAdminDashboard/Suppliers" element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                        <SuperAdminDashboardSuppliers />
                    </ProtectedRoute>
                } />
                <Route path="/SuperAdminDashboard/Roles" element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                        <SuperAdminDashboardRoles />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
};

export default App;