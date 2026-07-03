import { Link, useNavigate } from "react-router";
import { useState } from "react";

const UserSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });

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
            if (!res.ok) throw new Error(data.message || 'Signup failed');
            localStorage.setItem('token', data.token);
            alert('Signup successful!');
            navigate('/UserDashboard');
        } catch (error) {
            alert(error.message || 'Signup failed');
        }
    };

    return (
        <div className="auth-card">
            <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="btn-row">
                    <button type="submit" className="btn btn-success">Create Account</button>
                    <Link to="/UserLogin">
                        <button type="button" className="btn btn-primary">Go to Login</button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default UserSignup;