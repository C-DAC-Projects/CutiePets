import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";
import { login as loginService } from "../services/loginService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginService(email, password);
      console.log("Login API response:", res.data);

      if (res.status === 200 && res.data?.token) {
        // Save token
        localStorage.setItem("token", res.data.token);

        // ✅ Update AuthContext
        login({
          email: email,
          token: res.data.token,
          ...res.data.user // if API sends user details
        });

        // Redirect to dashboard
        navigate("/dashboard", { replace: true });
      } else {
        setError("Unexpected server response.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box text-center">
        <img
          src={logo}
          alt="Cutipets Logo"
          className="mb-2"
          style={{ width: "80px" }}
        />
        <h2 className="app-title">Cutipets</h2>
        <h5 className="admin-text mb-4">Admin Login</h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>

        <div className="text-end">
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-decoration-none small"
            style={{ cursor: "pointer" }}
          >
            Forgot Password?
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
