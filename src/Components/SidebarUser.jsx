import { useNavigate } from "react-router";

const SidebarUser = () => {
    const navigate = useNavigate();

    const handleDashboardClick = () => {
        navigate('/UserDashboard');
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-center">
                <div className="sidebar-items">
                    <div className="sidebar-item" onClick={handleDashboardClick}>Dashboard</div>
                </div>
            </div>
        </nav>
    );
};

export default SidebarUser;
