import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { IoClose } from "react-icons/io5"; // Close icon

const AuthForm = ({ onClose }) => {
  const { setUser, setShowUserLogin } = useAppContext();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy login/register logic
    const newUser = {
      username: formData.username || "User",
      email: formData.email,
    };

    setUser(newUser);         // Set user in context
    setShowUserLogin(false);  // Close modal
    onClose?.();              // Also call prop close function
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="wrapper active-popup">
        <span
          className="close-icon absolute top-0 right-0 w-12 h-12 flex items-center justify-center bg-black text-white text-2xl rounded-bl-lg cursor-pointer"
          onClick={onClose}
        >
          <IoClose />
        </span>

        {/* Toggle between Login and Register */}
        {isLogin ? (
          <div className="form-box login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <span className="icon">📧</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <label>Email</label>
              </div>
              <div className="input-box">
                <span className="icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <label>Password</label>
              </div>
              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot Password?</a>
              </div>
              <button type="submit" className="btn">Login</button>
              <div className="login-register">
                <p>
                  Don't have an account?{" "}
                  <span
                    className="register-link cursor-pointer font-bold"
                    onClick={() => setIsLogin(false)}
                  >
                    Register
                  </span>
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="form-box register">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <span className="icon">👤</span>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
                <label>Username</label>
              </div>
              <div className="input-box">
                <span className="icon">📧</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <label>Email</label>
              </div>
              <div className="input-box">
                <span className="icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <label>Password</label>
              </div>
              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> I agree to the terms & conditions
                </label>
              </div>
              <button type="submit" className="btn">Register</button>
              <div className="login-register">
                <p>
                  Already have an account?{" "}
                  <span
                    className="login-link cursor-pointer font-bold"
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </span>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
