import logo from "../assets/image.png";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const HeaderSuperAdmin = () => {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/UserLogin', { replace: true });
    };

    return (
        <header className="app-header">
            <div className="app-logo">INVENTORY APP</div>
            <div className="profile-section">
                <img
                    src={logo}
                    alt="Profile"
                    className="profile-avatar"
                    onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                    <div className="profile-dropdown">
                        <div className="dropdown-user-info">
                            <p className="user-name">{user.name}</p>
                            <p className="user-email">{user.email}</p>
                        </div>

                        <hr className="dropdown-divider" />

                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default HeaderSuperAdmin;