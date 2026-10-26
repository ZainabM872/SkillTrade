
import React, { useState } from "react";
import "../styles/signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToGuidelines: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!formData.agreedToGuidelines) {
      setError("Please agree to the Community Guidelines.");
      return;
    }

    setSuccess("Your form is valid! Account creation is not connected yet.");
  }

  return (
    <div className="skilltrade-signup">
      <div className="main-container">
        <div className="flex-column">
          <div className="header-divider" />

          <div className="card">
            <span className="create-account">
              Create your account
            </span>

            <form onSubmit={handleSubmit}>
              <label className="full-name" htmlFor="fullName">
                Full name
              </label>
              <div className="full-name-field">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="signup-input"
                  placeholder="Sara Moon"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <label className="email-label" htmlFor="email">
                Email address
              </label>
              <div className="email-field">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="signup-input"
                  placeholder="sara@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <label className="password-label" htmlFor="password">
                Password
              </label>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="signup-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              <label
                className="confirm-password"
                htmlFor="confirmPassword"
              >
                Confirm password
              </label>
              <div className="confirm-password-field">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="signup-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              <div className="guidelines-row">
                <input
                  id="agreedToGuidelines"
                  name="agreedToGuidelines"
                  type="checkbox"
                  className="guidelines-checkbox"
                  checked={formData.agreedToGuidelines}
                  onChange={handleChange}
                  required
                />

                <label
                  className="guidelines-agreement"
                  htmlFor="agreedToGuidelines"
                >
                  I agree to the
                </label>

                <a
                  className="community-guidelines-link"
                  href="/community-guidelines"
                  onClick={(event) => {
                    event.preventDefault();
                    alert("Community Guidelines page is not connected yet.");
                  }}
                >
                  Community Guidelines ↗
                </a>
              </div>

              {error && (
                <p className="signup-message signup-error" role="alert">
                  {error}
                </p>
              )}

              {success && (
                <p className="signup-message signup-success" role="status">
                  {success}
                </p>
              )}

              <button type="submit" className="home-button">
                <span className="create-account-1">
                  Create account
                </span>
              </button>
            </form>

            <p className="login-link">
              Already a member?{" "}
              <a href="/login">Log in</a>
            </p>
          </div>
        </div>

        <div className="hero-content">
          <span className="hero-eyebrow">
            A NEW WAY TO LEARN
          </span>

          <span className="hero-title">
            Your skills belong
            <br />
            here.
          </span>

          <span className="hero-description">
            Join a community of curious people. Share what you know
            and discover what’s next.
          </span>

          <div className="welcome-bonus-card">
            <span className="welcome-bonus-description">
              A one-time welcome bonus for your first account.
              Your first hour of learning is on us.
            </span>

            <span className="welcome-bonus-points">
              Start with 15 points
            </span>

            <div className="sparkle-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
