import { Link, useNavigate } from "react-router";

const AdminLanding = () => {
    const navigate = useNavigate();
    return (
        <div className="landing">
            <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
            <h1>Welcome to the Inventory Management Application</h1>
            <p>Login to manage your inventory.</p>
            <div className="btn-row-center">
                <Link to="/AdminLogin">
                    <button className="btn btn-primary">Login as Admin</button>
                </Link>
            </div>
        </div>
    );
};

export default AdminLanding;