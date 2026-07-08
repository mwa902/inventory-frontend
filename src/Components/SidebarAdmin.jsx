import { useNavigate } from "react-router";

const SidebarAdmin = () => {
    const navigate = useNavigate();
    
    const handleDashboardClick = () => {
        navigate('/AdminDashboard');
    };
    const handleProductsClick = () => {
        // Example routes that could exist for admin
        navigate('/AdminDashboard');
    };
    const handleCategoriesClick = () => {
        navigate('/AdminDashboard');
    };
    const handleSuppliersClick = () => {
        navigate('/AdminDashboard');
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-center">
                <div className="sidebar-items">
                    <div className="sidebar-item" onClick={handleDashboardClick}>Dashboard</div>
                    <div className="sidebar-item" onClick={handleProductsClick}>Products</div>
                    <div className="sidebar-item" onClick={handleCategoriesClick}>Categories</div>
                    <div className="sidebar-item" onClick={handleSuppliersClick}>Suppliers</div>
                </div>
            </div>
        </nav>
    );
};

export default SidebarAdmin;
