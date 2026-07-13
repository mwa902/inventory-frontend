import logo from "../assets/image.png";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const HeaderAdmin = () => {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;
        
        const formData = new FormData();
        formData.append("profilePicture", file);
        
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`http://localhost:5000/api/user/${user._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            const updatedUser = response.data;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
            console.error("Failed to upload profile picture", error);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <header className="app-header">
            <div className="app-logo">INVENTORY APP - ADMIN</div>
            <div className="profile-section">
                <img
                    src={user?.profilePicture ? `http://localhost:5000${user.profilePicture}` : logo}
                    alt="Profile"
                    className="profile-avatar"
                    onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                    <div className="profile-dropdown">
                        <div className="dropdown-user-info">
                            <img 
                                src={user?.profilePicture ? `http://localhost:5000${user.profilePicture}` : logo}
                                alt="Profile Large"
                                className="dropdown-avatar-large"
                                onClick={triggerFileInput}
                                style={{ cursor: "pointer", width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }}
                                title="Click to update profile picture"
                            />
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: "none" }} 
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <p className="user-name">{user?.name}</p>
                            <p className="user-email">{user?.email}</p>
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

export default HeaderAdmin;
