
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/support-sent.css";

export default function SupportSent() {
  const navigate = useNavigate();

  return (
    <div className="support-sent-page">
      <header className="support-sent-header">
        <Link
          to="/"
          className="support-sent-brand"
          aria-label="SkillTrade home"
        >
          <span className="support-sent-brand-icon" aria-hidden="true">
            ✦
          </span>
          <span>SkillTrade</span>
        </Link>

        <nav className="support-sent-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/sessions">Sessions</NavLink>
          <NavLink to="/teach">Teach a skill</NavLink>
        </nav>

        <div className="support-sent-header-actions">
          <Link
            to="/profile"
            className="support-sent-points"
            aria-label="View your profile and points"
          >
            <span aria-hidden="true">✦</span> 120 points
          </Link>

          <Link
            to="/profile"
            className="support-sent-avatar"
            aria-label="Go to your profile"
          >
            SM
          </Link>
        </div>
      </header>

      <main className="support-sent-main">
        <section
          className="support-sent-card"
          aria-labelledby="support-sent-title"
          aria-describedby="support-sent-description"
        >
          <button
            type="button"
            className="support-sent-close"
            onClick={() => navigate("/help")}
            aria-label="Return to the Help page"
            title="Return to help"
          >
            <span aria-hidden="true">×</span>
          </button>

          <div className="support-sent-icon" aria-hidden="true">
            <span>✦</span>
          </div>

          <h1 id="support-sent-title">Message sent</h1>

          <p
            id="support-sent-description"
            className="support-sent-message"
            role="status"
          >
            Thanks for reaching out. Your support request is ready for the
            SkillTrade team. We'll be in touch as soon as possible.
          </p>

          <Link to="/help" className="support-sent-help-button">
            Back to help
          </Link>

          <p className="support-sent-extra">
            Need something else? You can return to the Help page to browse
            frequently asked questions.
          </p>
        </section>
      </main>
    </div>
  );
}
