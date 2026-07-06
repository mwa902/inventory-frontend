import { Routes, Route } from "react-router";
import "./App.css";
import GetStarted from "./pages/GetStarted";
import UserLogin from "./pages/UserLogin";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard, { SuperAdminDashboardUsers, SuperAdminDashboardProducts, SuperAdminDashboardCategories, SuperAdminDashboardSuppliers } from "./pages/SuperAdminDashboard";
import UserCreate from "./pages/UserCreate";

const App = () => {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<GetStarted />} />
                <Route path="/UserLogin" element={<UserLogin />} />
                <Route path="/UserDashboard" element={<UserDashboard />} />
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                <Route path="/SuperAdminDashboard" element={<SuperAdminDashboard />} />
                <Route path="/SuperAdminDashboard/User" element={<SuperAdminDashboardUsers />} />
                <Route path="/SuperAdminDashboard/Products" element={<SuperAdminDashboardProducts />} />
                <Route path="/SuperAdminDashboard/Categories" element={<SuperAdminDashboardCategories />} />
                <Route path="/SuperAdminDashboard/Suppliers" element={<SuperAdminDashboardSuppliers />} />
                <Route path="/UserCreate" element={<UserCreate />} />
            </Routes>
        </div>
    );
};

export default App;