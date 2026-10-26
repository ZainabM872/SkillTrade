
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/reset-password.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    // UI-only demonstration. Connect your authentication backend here
    // to send a real password-reset email.
    setMessage(
      "If an account exists for this email, password-reset instructions will be sent."
    );
    setIsSubmitting(false);
  }

  return (
    <div className="reset-page">
      <header className="reset-header">
        <div className="reset-header-inner">
          <Link className="reset-brand" to="/">
            SkillTrade
          </Link>

          <nav className="reset-nav" aria-label="Main navigation">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="/sessions">Sessions</NavLink>
            <NavLink to="/teach">Teach a skill</NavLink>
          </nav>

          <div className="reset-header-actions">
            <Link className="reset-points" to="/profile">
              <span aria-hidden="true">✦</span>
              <span>120 points</span>
            </Link>

            <Link
              className="reset-avatar"
              to="/profile"
              aria-label="Go to your profile"
            >
              SM
            </Link>
          </div>
        </div>
      </header>

      <main className="reset-main">
        <section className="reset-card" aria-labelledby="reset-title">
          <button
            type="button"
            className="reset-close"
            onClick={() => navigate("/login")}
            aria-label="Close and return to login"
            title="Back to login"
          >
            <span aria-hidden="true">×</span>
          </button>

          <div className="reset-card-content">
            <div className="reset-icon" aria-hidden="true">
              ✉
            </div>

            <h1 id="reset-title">Reset your password</h1>

            <p className="reset-description">
              Forgot your password? Enter the email address associated with
              your account and we’ll help you get back in.
            </p>

            <form className="reset-form" onSubmit={handleSubmit}>
              <label htmlFor="reset-email">Email address</label>

              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="sara@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setMessage("");
                }}
                required
              />

              <button
                type="submit"
                className="reset-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send reset link"}
              </button>

              {message && (
                <p
                  className="reset-message"
                  role="status"
                  aria-live="polite"
                >
                  {message}
                </p>
              )}
            </form>

            <div className="reset-divider">
              <span>Remember your password?</span>
            </div>

            <Link className="reset-login-link" to="/login">
              Back to login
            </Link>

            <p className="reset-help-text">
              Need help?{" "}
              <Link to="/help">Visit our Help page</Link>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
