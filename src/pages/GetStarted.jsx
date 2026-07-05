import { Link } from "react-router";

const UserTypeLanding = () => {
    return (
        <div className="auth-card">
            <h1>Welcome to the Inventory Management Application</h1>
            <div className="btn-row">
                <Link to="/UserLogin">
                    <button className="btn btn-primary">Get Started</button>
                </Link>
            </div>
        </div>
    );
};

export default UserTypeLanding;