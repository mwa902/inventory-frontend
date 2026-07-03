import { Routes, Route } from "react-router";
import UserTypeLanding from "./pages/UserTypeLanding";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import AdminLanding from "./pages/AdminLanding";
import UserLanding from "./pages/UserLanding";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<UserTypeLanding />} />
                <Route path="/AdminLogin" element={<AdminLogin />} />
                <Route path="/UserLogin" element={<UserLogin />} />
                <Route path="/UserSignup" element={<UserSignup />} />
                <Route path="/AdminLanding" element={<AdminLanding />} />
                <Route path="/UserLanding" element={<UserLanding />} />
                <Route path="/UserDashboard" element={<UserDashboard />} />
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
            </Routes>
        </div>
    );
};

export default App;