import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    
    if (!token || !userString) {
        return <Navigate to="/UserLogin" replace />;
    }

    try {
        const user = JSON.parse(userString);
        const roleName = user?.role?.roleName?.toLowerCase() || user?.role?.toLowerCase();

        if (allowedRoles && !allowedRoles.includes(roleName)) {
            // Redirect based on their actual role if they try to access unauthorized pages
            if (roleName === "superadmin") {
                return <Navigate to="/SuperAdminDashboard" replace />;
            } else if (roleName === "admin") {
                return <Navigate to="/AdminDashboard" replace />;
            } else {
                return <Navigate to="/UserDashboard" replace />;
            }
        }

        return children;
    } catch (error) {
        console.error("Error parsing user data in ProtectedRoute", error);
        return <Navigate to="/UserLogin" replace />;
    }
};

export default ProtectedRoute;
