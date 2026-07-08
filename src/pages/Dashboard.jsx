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
            <Header />
            <div className="dashboard-layout">
                <Sidebar />
                <div className="content">
                    <h1 className="welcome">Welcome {user?.name || 'User'}</h1>

                </div>
            </div>
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
            <Header />
            <div className="dashboard-layout">
                <Sidebar />
                <div className="content">
                    <h1 className="welcome">Welcome {user?.name || 'User'}</h1>

                </div>
            </div>
        </div>
    );
};


const SuperAdminDashboardUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5000/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setUsers(Array.isArray(data) ? data : []))
                .catch(() => { });
            fetch('http://localhost:5000/api/role', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setRoles(Array.isArray(data) ? data : []))
                .catch(() => { });
        } else {
            navigate('/UserLogin', { replace: true });
        }
    }, [navigate]);

    const openEdit = (user) => {
        setEditingUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role?._id || user.role
        });
    };

    const saveEdit = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/user/${editingUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(editForm)
        })
            .then(res => res.json())
            .then(updated => {
                setUsers(users.map(u => u._id === updated._id ? { ...u, ...updated } : u));
                setEditingUser(null);
            })
            .catch(() => { });
    };

    const DeleteUser = (userId) => {
        if (confirm("Are you sure you want to delete this user?")) {
            const token = localStorage.getItem('token');
            fetch(`http://localhost:5000/api/user/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => setUsers(users.filter(u => u._id !== userId)))
                .catch(() => { });
        }
    };

    return (
        <div>
            <Header />
            <div className="dashboard-layout">
                <Sidebar />
                <div className="content">
                    <h1>Users</h1>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>User Email</th>
                                <th>User Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role?.roleName || u.role}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => openEdit(u)}>Edit</button>
                                        {' '}
                                        <button className="delete-button" onClick={() => DeleteUser(u._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingUser && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Edit User</h2>
                        <div className="modal-field">
                            <label>Name</label>
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Email</label>
                            <input
                                type="email"
                                value={editForm.email}
                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="modal-field">
                            <label>Role</label>
                            <select
                                value={editForm.role}
                                onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                            >
                                {roles.map(r => (
                                    <option key={r._id} value={r._id}>{r.roleName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-primary" onClick={saveEdit}>Save</button>
                            <button className="btn-cancel" onClick={() => setEditingUser(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SuperAdminDashboardProducts = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            fetch('http://localhost:5000/api/product', {
                headers: { Authorization: `Bearer ${parsed.token}` }
            })
                .then(res => res.json())
                .then(data => setProducts(Array.isArray(data) ? data : []))
                .catch(() => { });
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
                    <table className="table">
                        <thead>
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
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id}>
                                    <td>{p.product_name}</td>
                                    <td>{p.product_description}</td>
                                    <td>{p.purchase_price}</td>
                                    <td>{p.selling_price}</td>
                                    <td>{p.Stock}</td>
                                    <td>{p.category?.category_name || p.category}</td>
                                    <td>{p.supplier?.Name || p.supplier}</td>
                                    <td><img src={p.image} alt={p.product_name} width="40" /></td>
                                    <td>{p.status}</td>
                                    <td><button>Edit</button> <button>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
const SuperAdminDashboardCategories = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            fetch('http://localhost:5000/api/category', {
                headers: { Authorization: `Bearer ${parsed.token}` }
            })
                .then(res => res.json())
                .then(data => setCategories(Array.isArray(data) ? data : []))
                .catch(() => { });
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
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Category Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(c => (
                                <tr key={c._id}>
                                    <td>{c.category_name}</td>
                                    <td>{c.description}</td>
                                    <td><button>Edit</button> <button>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
const SuperAdminDashboardSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            fetch('http://localhost:5000/api/supplier', {
                headers: { Authorization: `Bearer ${parsed.token}` }
            })
                .then(res => res.json())
                .then(data => setSuppliers(Array.isArray(data) ? data : []))
                .catch(() => { });
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
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Supplier Phone</th>
                                <th>Supplier Company</th>
                                <th>Supplier Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map(s => (
                                <tr key={s._id}>
                                    <td>{s.Name}</td>
                                    <td>{s.phone_number}</td>
                                    <td>{s.company}</td>
                                    <td>{s.status}</td>
                                    <td><button>Edit</button> <button>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


const SuperAdminDashboardRoles = () => {
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5000/api/role', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setRoles(Array.isArray(data) ? data : []))
                .catch(() => { });
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
                    <table className="tablerole">
                        <thead>
                            <tr>
                                <th>Role Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map(r => (
                                <tr key={r._id}>
                                    <td>{r.roleName}</td>
                                    <td><button>Edit</button> <button>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
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