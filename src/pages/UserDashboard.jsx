import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

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

export default UserDashboard;