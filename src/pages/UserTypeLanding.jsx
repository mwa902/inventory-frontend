import { Link } from "react-router";

const UserTypeLanding = () => {
    return (
        <div className="auth-card">
            <h1>Welcome to the Inventory Management Application</h1>
            <div className="btn-row">
                <Link to="/AdminLanding">
                    <button className="btn btn-primary">Admin Login</button>
                </Link>
                <Link to="/UserLanding">
                    <button className="btn btn-success">User Login</button>
                </Link>
            </div>
        </div>
    );
};

export default UserTypeLanding;