import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../Components/HeaderSuperAdmin";
import Sidebar from "../Components/SidebarSuperAdmin";


const AdminDashboard = () => {
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

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/UserLogin', { replace: true });
    };

    return (
        <div>
            <h1>Welcome {user?.name || 'User'}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

const UserDashboard = () => {
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

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/UserLogin', { replace: true });
    };

    return (
        <div>
            <h1>Welcome {user?.name || 'User'}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};


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
                    <table>
                        <tr>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>User Role</th>
                            <th>Actions</th>
                        </tr>
                    </table>
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
                    <table>
                        <tr>
                            <th>Product Name</th>
                            <th>Product Description</th>
                            <th>Product Purchase Price</th>
                            <th>Product Selling Price</th>
                            <th>Product Stock</th>
                            <th>Product Category</th>
                            <th>Product Supplier</th>
                            <th>Product Image</th>
                            <th>Product Status</th>
                            <th>Actions</th>
                        </tr>
                    </table>
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
                    <table>
                        <tr>
                            <th>Category Name</th>
                            <th>Category Description</th>
                            <th>Actions</th>
                        </tr>
                    </table>
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
                    <table>
                        <tr>
                            <th>Supplier Name</th>
                            <th>Supplier Phone</th>
                            <th>Supplier Company</th>
                            <th>Supplier Status</th>
                            <th>Actions</th>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    );
};


const SuperAdminDashboardRoles = () => {
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
                    <h1>Roles</h1>
                    <table>
                        <tr>
                            <th>Role Name</th>
                            <th>Actions</th>
                        </tr>
                    </table>
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
                            <div className="card-body">
                                <h2>Users</h2>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h2>Products</h2>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h2>Categories</h2>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h2>Suppliers</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { SuperAdminDashboardRoles, SuperAdminDashboardUsers, SuperAdminDashboardProducts, SuperAdminDashboardCategories, SuperAdminDashboardSuppliers, AdminDashboard, UserDashboard, SuperAdminDashboard };