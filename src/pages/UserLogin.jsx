import { useNavigate } from "react-router-dom";
import { useState } from "react";


const UserLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("user", JSON.stringify(data.userData));
      localStorage.setItem("token", data.token);

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
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your inventory workspace</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
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
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
