import { Routes, Route, Navigate } from "react-router";
import "./App.css";
import UserLogin from "./pages/UserLogin";
import { SuperAdminDashboard, AdminDashboard, UserDashboard, SuperAdminDashboardUsers, SuperAdminDashboardProducts, SuperAdminDashboardCategories, SuperAdminDashboardSuppliers, SuperAdminDashboardRoles } from "./pages/Dashboard";
import UserCreate from "./pages/UserCreate";

const App = () => {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<Navigate to="/UserLogin" replace />} />
                <Route path="/UserLogin" element={<UserLogin />} />
                <Route path="/UserDashboard" element={<UserDashboard />} />
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                <Route path="/SuperAdminDashboard" element={<SuperAdminDashboard />} />
                <Route path="/SuperAdminDashboard/User" element={<SuperAdminDashboardUsers />} />
                <Route path="/SuperAdminDashboard/Products" element={<SuperAdminDashboardProducts />} />
                <Route path="/SuperAdminDashboard/Categories" element={<SuperAdminDashboardCategories />} />
                <Route path="/SuperAdminDashboard/Suppliers" element={<SuperAdminDashboardSuppliers />} />
                <Route path="/SuperAdminDashboard/Roles" element={<SuperAdminDashboardRoles />} />
                <Route path="/UserCreate" element={<UserCreate />} />
            </Routes>
        </div>
    );
};

export default App;