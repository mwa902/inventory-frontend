import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../Components/HeaderSuperAdmin";
import Sidebar from "../Components/SidebarSuperAdmin";

const SuperAdminDashboardUsers = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            navigate('/UserLogin', { replace: true });
        }
    }, [navigate]);
    return (
        <div>
            <Header />
            <div className="dashboard-layout">
                <Sidebar />
                <div className="content">
                    <h1>Users</h1>
                </div>
            </div>
        </div>
    );
};
const SuperAdminDashboardProducts = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            navigate('/UserLogin', { replace: true });
        }
    }, [navigate]);
    return (
        <div>
            <Header />
            <div className="dashboard-layout">
                <Sidebar />
                <div className="content">
                    <h1>Products</h1>
                </div>
            </div>
        </div>
    );
};
const SuperAdminDashboardCategories = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            navigate('/UserLogin', { replace: true });
        }
    }, [navigate]);
    return (
        <div>
            <Header />
            <div className="dashboard-layout">
                <Sidebar />
                <div className="content">
                    <h1>Categories</h1>
                </div>
            </div>
        </div>
    );
};
const SuperAdminDashboardSuppliers = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            navigate('/UserLogin', { replace: true });
        }
    }, [navigate]);
    return (
        <div>
            <Header />
            <div className="dashboard-layout">
                <Sidebar />
                <div className="content">
                    <h1>Suppliers</h1>
                </div>
            </div>
        </div>
    );
};
const SuperAdminDashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            navigate('/UserLogin', { replace: true });
        }
    }, [navigate]);

    return (
        <div>
            <Header />
            <div className="dashboard-layout">
                <Sidebar />
                <div className="content">
                    <h1 className="welcome">Welcome {user?.name || 'User'}</h1>
                    <div className="card-container">
                        <div className="card">
                            <div classname="card-body">
                                <h2>Users</h2>
                            </div>
                        </div>
                        <div className="card">
                            <div classname="card-body">
                                <h2>Products</h2>
                            </div>
                        </div>
                        <div className="card">
                            <div classname="card-body">
                                <h2>Categories</h2>
                            </div>
                        </div>
                        <div className="card">
                            <div classname="card-body">
                                <h2>Suppliers</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { SuperAdminDashboardUsers, SuperAdminDashboardProducts, SuperAdminDashboardCategories, SuperAdminDashboardSuppliers };
export default SuperAdminDashboard;