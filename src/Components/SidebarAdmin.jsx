import { useNavigate } from "react-router";

const SidebarAdmin = () => {
    const navigate = useNavigate();

    const handleDashboardClick = () => {
        navigate('/AdminDashboard');
    };
    const handleOrdersClick = () => {
        navigate('/AdminDashboard/Orders');
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-center">
                <div className="sidebar-items">
                    <div className="sidebar-item" onClick={handleDashboardClick}>Dashboard</div>
                    <div className="sidebar-item" onClick={handleOrdersClick}>Orders</div>
                </div>
            </div>
        </nav>
    );
};

export default SidebarAdmin;
