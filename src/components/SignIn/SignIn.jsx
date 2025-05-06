import React, { useState } from "react";
import Toast from "../Toast/Toast";
import { useAuth } from "../../context/AuthContext";
import "./SignIn.css";

const SignIn = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    if (name === "username" && value.length < 4) {
      return "Username must be at least 4 characters long";
    }
    if (name === "password" && value.length < 4) {
      return "Password must be at least 4 characters long";
    }
    return "";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    
    const error = validateField(id, value);
    setErrors(prev => ({
      ...prev,
      [id]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const usernameError = validateField("username", formData.username);
    const passwordError = validateField("password", formData.password);
    setErrors({
      username: usernameError,
      password: passwordError
    });

    if (usernameError || passwordError) {
      setError(usernameError || passwordError);
      return;
    }

    setIsLoading(true);

    if (formData.username === "Bhavesh" && formData.password === "1234") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      login();
    } else {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <section className="movie-auth">
      <div className="movie-auth-container">
        <div className="movie-auth-form">
          <h1>Sign in</h1>
          <p>Sign in to your Self Service Portal</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="movie-input-group">
              <input
                type="text"
                id="username"
                required
                placeholder=" "
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "error" : ""}
                disabled={isLoading}
              />
              <label htmlFor="username">Username</label>
              {errors.username && <span className="movie-error-text">{errors.username}</span>}
            </div>
            <div className="movie-input-group">
              <input
                type="password"
                id="password"
                required
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                disabled={isLoading}
              />
              <label htmlFor="password">Password</label>
              {errors.password && <span className="movie-error-text">{errors.password}</span>}
            </div>
            <button 
              type="submit" 
              className="movie-submit-button" 
              disabled={isLoading}
            >
              {isLoading && <div className="movie-progress-bar" />}
              <span className="movie-button-text">
                {isLoading ? 'Signing in...' : 'Log In'}
              </span>
            </button>
          </form>
        </div>
      </div>
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError("")}
          duration={3000}
        />
      )}
    </section>
  );
};

export default SignIn;
