import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LimitedAction from "../Components/limitedaction";

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showLimitedModal, setShowLimitedModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("user", JSON.stringify(data.userData));

      const roleName = data.userData.role.roleName.toLowerCase();

      if (roleName === "admin") {
        navigate("/AdminDashboard", { replace: true });
      } else if (roleName === "superadmin") {
        navigate("/SuperAdminDashboard", { replace: true });
      } else {
        navigate("/UserDashboard", { replace: true });
      }
    } catch (error) {
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div
        className={`auth-card ${showLimitedModal ? "auth-card--blurred" : ""}`}
      >
        <button className="btn-back" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account?{" "}
          <button
            type="button"
            className="auth-link-button"
            onClick={() => setShowLimitedModal(true)}
          >
            Sign Up
          </button>
        </p>
      </div>

      {showLimitedModal && (
        <LimitedAction
          onContinue={() => {
            setShowLimitedModal(false);
            navigate("/");
          }}
        />
      )}
    </div>
  );
};

export default UserLogin;
