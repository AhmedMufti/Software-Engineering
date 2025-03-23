import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import "./signup.css"; // Import custom CSS
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the Terms and Conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setSuccessMessage(response.data.msg);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          termsAccepted: false,
        });
        setErrors({});
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors({ apiError: error.response.data.msg });
        } else {
          setErrors({ apiError: "An error occurred during registration" });
        }
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errors.apiError && <div className="alert alert-danger">{errors.apiError}</div>}
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <small className="error-text">{errors.name}</small>}
        </div>

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

        {/* Confirm Password Field */}
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <small className="error-text">{errors.confirmPassword}</small>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="terms"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="terms">
            By signing up, I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms and Conditions
            </a>
            .
          </label>
          {errors.termsAccepted && (
            <small className="error-text">{errors.termsAccepted}</small>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>

      {/* Extra Options */}
      <div className="signup-extra-links">
        <div className="mt-2">
          Already have an account? <a href="/Login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
