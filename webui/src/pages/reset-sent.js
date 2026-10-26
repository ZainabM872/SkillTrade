
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/reset-sent.css";

export default function ResetSent() {
  const navigate = useNavigate();

  // Replace this with the email passed from your reset-password page
  // when you connect the two pages.
  const email = "sara@example.com";

  return (
    <div className="reset-sent-page">
      <header className="reset-sent-header">
        <Link to="/" className="reset-sent-brand" aria-label="SkillTrade home">
          <span className="reset-sent-brand-icon" aria-hidden="true">
            ✦
          </span>
          <span>SkillTrade</span>
        </Link>

        <nav className="reset-sent-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/sessions">Sessions</NavLink>
          <NavLink to="/teach">Teach a skill</NavLink>
        </nav>

        <div className="reset-sent-header-actions">
          <Link
            to="/profile"
            className="reset-sent-points"
            aria-label="View your profile and points"
          >
            <span aria-hidden="true">✦</span> 120 points
          </Link>

          <Link
            to="/profile"
            className="reset-sent-avatar"
            aria-label="Go to your profile"
          >
            SM
          </Link>
        </div>
      </header>

      <main className="reset-sent-main">
        <section
          className="reset-sent-card"
          aria-labelledby="reset-sent-title"
        >
          <button
            type="button"
            className="reset-sent-close"
            onClick={() => navigate("/login")}
            aria-label="Return to login"
            title="Return to login"
          >
            <span aria-hidden="true">×</span>
          </button>

          <div className="reset-sent-icon" aria-hidden="true">
            <span>✦</span>
          </div>

          <h1 id="reset-sent-title">Check your inbox</h1>

          <p className="reset-sent-message">
            A password reset link has been sent to{" "}
            <strong>{email}</strong>.
            Please check your inbox and follow the instructions to reset
            your password.
          </p>

          <Link to="/login" className="reset-sent-login-button">
            Back to login
          </Link>

          <p className="reset-sent-help">
            Didn't receive the email? Check your spam folder or{" "}
            <Link to="/help">contact support</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}
