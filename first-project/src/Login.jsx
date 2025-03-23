import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import "./Login.css"; // Custom CSS for Login
import axios from "axios"; // Import Axios for HTTP requests
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Basic form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("/api/auth/login", formData);
        console.log("Login successful:", response.data);
        // Handle successful login, e.g., store token, redirect user
        navigate("/dashboard"); // Redirect to dashboard or another page
      } catch (error) {
        console.error("Login error:", error.response.data);
        setServerError(error.response.data.message || "Login failed");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <small className="error-text">{errors.email}</small>}
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <small className="error-text">{errors.password}</small>
          )}
        </div>

        {/* Server Error Message */}
        {serverError && <div className="alert alert-danger">{serverError}</div>}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>

      {/* Extra Options */}
      <div className="login-extra-links">
        <div className="mt-3">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        <div className="mt-2">
          Don't have an account? <a href="/signup">Signup</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
