import { Routes, Route, Navigate } from "react-router-dom";
import "./AppNew.css";
import UserLogin from "./pages/UserLogin";
import { SuperAdminDashboard, AdminDashboard, AdminDashboardCheckout, AdminDashboardOrders, AdminDashboardProducts, AdminDashboardCategories, AdminDashboardSuppliers, UserDashboard, SuperAdminDashboardUsers, SuperAdminDashboardCheckout, SuperAdminDashboardProducts, SuperAdminDashboardCategories, SuperAdminDashboardSuppliers, SuperAdminDashboardRoles, SuperAdminDashboardOrders } from "./pages/Dashboard";
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
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/AdminDashboard/Orders" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboardOrders />
                    </ProtectedRoute>
                } />
                <Route path="/AdminDashboard/Products" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboardProducts />
                    </ProtectedRoute>
                } />
                <Route path="/AdminDashboard/Categories" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboardCategories />
                    </ProtectedRoute>
                } />
                <Route path="/AdminDashboard/Suppliers" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboardSuppliers />
                    </ProtectedRoute>
                } />
                <Route path="/AdminDashboard/Checkout" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboardCheckout />
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
                <Route path="/SuperAdminDashboard/Orders" element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                        <SuperAdminDashboardOrders />
                    </ProtectedRoute>
                } />
                <Route path="/SuperAdminDashboard/Checkout" element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                        <SuperAdminDashboardCheckout />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
};

export default App;