import { Routes, Route } from "react-router";
import GetStarted from "./pages/GetStarted";
import UserLogin from "./pages/UserLogin";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
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
                <Route path="/UserCreate" element={<UserCreate />} />
            </Routes>
        </div>
    );
};

export default App;