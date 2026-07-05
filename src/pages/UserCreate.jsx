import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const UserCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '', name: '', role: '' });
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/role")
            .then(res => res.json())
            .then(data => setRoles(data))
            .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'User creation failed');
            alert('User created successfully!');
            navigate('/SuperAdminDashboard', { replace: true });
        } catch (error) {
            alert(error.message || 'User creation failed');
        }
    };

    return (
        <div className="auth-card">
            <div className="btn-row">
                <button className="btn btn-back" onClick={() => navigate("/SuperAdminDashboard")}>← Back</button>
            </div>
            <h1>Create User</h1>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="field">
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="field">
                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="">Select Role</option>
                        {roles.map(role => (
                            <option key={role._id} value={role._id}>{role.roleName}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Create User</button>
            </form>
        </div>
    );
};

export default UserCreate;