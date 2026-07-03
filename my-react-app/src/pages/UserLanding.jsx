import { Link, useNavigate } from "react-router";

const UserLanding = () => {
    const navigate = useNavigate();
    return (
        <div className="landing">
            <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
            <h1>Welcome to Inventory Management Application</h1>
            <p>Login to view inventory or signup for a new account.</p>
            <div className="btn-row-center">
                <Link to="/UserLogin">
                    <button className="btn btn-primary">Login</button>
                </Link>
                <Link to="/UserSignup">
                    <button className="btn btn-success">Signup</button>
                </Link>
            </div>
        </div>
    );
};

export default UserLanding;