import React, { useState } from "react";
import "../styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE = "https://localhost:44337/api/auth";

  const handleSendOtp = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "https://localhost:44337/api/auth/send-otp",
      { email: email }, // ✅ Matches EmailRequest.Email
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(response.data.message);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};




  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/verify-otp`, { email, otp });
      if (res.data.success) {
        setMessage("OTP verified successfully. You can now reset your password.");
        setStep(3);
      } else {
        setError(res.data.message || "Invalid OTP.");
      }
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/reset-password`, { email, otp, newPassword });
      if (res.data.success) {
        setMessage("Password reset successfully. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(res.data.message || "Error resetting password.");
      }
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box text-center">
        <img src={logo} alt="Cutipets Logo" className="mb-2" style={{ width: "80px" }} />
        <h2 className="app-title">Cutipets</h2>

        {step === 1 && <h5 className="admin-text mb-4">Forgot Password</h5>}
        {step === 2 && <h5 className="admin-text mb-4">Enter OTP</h5>}
        {step === 3 && <h5 className="admin-text mb-4">Reset Password</h5>}

        {error && <div className="alert alert-danger small">{error}</div>}
        {message && <div className="alert alert-success small">{message}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="mb-3 text-start">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-3 text-start">
              <label className="form-label">Enter OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter the OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-3 text-start">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100 mb-3">
              Reset Password
            </button>
          </form>
        )}

        <div className="text-start">
          <a href="/login" className="btn btn-link text-decoration-none small p-0">
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
