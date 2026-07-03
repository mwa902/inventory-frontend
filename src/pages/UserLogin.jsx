import { useNavigate, Link } from "react-router";
import { useState } from "react";

const UserLogin = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            navigate('/UserDashboard');
        } catch (error) {
            alert(error.message || 'Login failed');
        }
    };

    return (
        <div className="auth-card">
            <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
            <h2>User Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <p className="auth-footer">
                Don't have an account? <Link to="/UserSignup">Sign Up</Link>
            </p>
        </div>
    );
};

export default UserLogin;