import { useNavigate } from "react-router";

const SidebarSuperAdmin = () => {
    const navigate = useNavigate();
    const handleDashboardClick = () => {
        navigate('/SuperAdminDashboard');
    };
    const handleUsersClick = () => {
        navigate('/SuperAdminDashboard/User');
    };
    const handleProductsClick = () => {
        navigate('/SuperAdminDashboard/Products');
    };
    const handleCategoriesClick = () => {
        navigate('/SuperAdminDashboard/Categories');
    };
    const handleSuppliersClick = () => {
        navigate('/SuperAdminDashboard/Suppliers');
    };
    return (
        <nav className="sidebar">
            <div className="sidebar-center">
                <div className="sidebar-items">
                    <div className="sidebar-item" onClick={handleDashboardClick}>Dashboard</div>
                    <div className="sidebar-item" onClick={handleUsersClick}>Users</div>
                    <div className="sidebar-item" onClick={handleProductsClick}>Products</div>
                    <div className="sidebar-item" onClick={handleCategoriesClick}>Categories</div>
                    <div className="sidebar-item" onClick={handleSuppliersClick}>Suppliers</div>
                </div>
            </div>
        </nav>
    );
};

export default SidebarSuperAdmin;