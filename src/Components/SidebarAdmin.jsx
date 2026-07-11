import { useNavigate } from "react-router";

const SidebarAdmin = () => {
    const navigate = useNavigate();

    const handleDashboardClick = () => {
        navigate('/AdminDashboard');
    };
    const handleOrdersClick = () => {
        navigate('/AdminDashboard/Orders');
    };
    const handleProductsClick = () => {
        navigate('/AdminDashboard/Products');
    };
    const handleCategoriesClick = () => {
        navigate('/AdminDashboard/Categories');
    };
    const handleSuppliersClick = () => {
        navigate('/AdminDashboard/Suppliers');
    };
    const handleCheckoutClick = () => {
        navigate('/AdminDashboard/Checkout');
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-center">
                <div className="sidebar-items">
                    <div className="sidebar-item" onClick={handleDashboardClick}>Dashboard</div>
                    <div className="sidebar-item" onClick={handleOrdersClick}>Orders</div>
                    <div className="sidebar-item" onClick={handleProductsClick}>Products</div>
                    <div className="sidebar-item" onClick={handleCategoriesClick}>Categories</div>
                    <div className="sidebar-item" onClick={handleSuppliersClick}>Suppliers</div>
                    <div className="sidebar-item" onClick={handleCheckoutClick}>Checkout</div>
                </div>
            </div>
        </nav>
    );
};

export default SidebarAdmin;
