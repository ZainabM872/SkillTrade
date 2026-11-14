import React from "react";
import "../styles/booking-faq.css"; // shared FAQ styles (same layout as the booking FAQ)
import "../App.css"; // shared banner styles (same as the other pages)
import { NavLink, useNavigate } from "react-router-dom";

const STEPS = [
  {
    number: "01",
    title: "Open your session",
    text: "Open the session from Sessions, then choose Cancel or Reschedule.",
  },
  {
    number: "02",
    title: "Give 48 hours’ notice",
    text: "Make changes at least 48 hours before the session. Choose a new available date and time when rescheduling.",
  },
  {
    number: "03",
    title: "Confirm the change",
    text: "Check Sessions afterward to confirm the updated status and meeting details.",
  },
];

export default function CancellationFAQ() {
  const navigate = useNavigate();

  return (
    <main>
      {/* top banner: identical to the other pages */}
      <div className="banner">
        <span className="logo-text">
          <span className="skill-text">skill</span>
          <span className="trade-text">Trade</span>
        </span>
        <nav className="nav">
          <NavLink className="nav-link" to="/homepage">
            Home
          </NavLink>
          <NavLink className="nav-link" to="/explore">
            Explore
          </NavLink>
          <NavLink className="nav-link" to="/sessions">
            Sessions
          </NavLink>
          <NavLink className="nav-link" to="/teach">
            Teach a skill
          </NavLink>
        </nav>
        <div className="banner-right">
          <div className="points-box">
            <span className="skillpoints">
              <span className="points-icon" />
              <span className="skillpoints-text">150 points</span>
            </span>
          </div>

          <button
            type="button"
            className="notifs-box"
            aria-label="Notifications"
            onClick={() => navigate("/notifications")}
          >
            <span className="notifs-icon" />
          </button>

          <button
            type="button"
            className="profile-box"
            aria-label="Your profile"
            onClick={() => navigate("/profile")}
          >
            <span className="userprofile">SM</span>
          </button>
        </div>
      </div>

      <div className="faq-page">
        {/* heading */}
        <p className="faq-eyebrow">SKILLTRADE HELP</p>
        <h1 className="faq-title">Can I cancel or reschedule?</h1>
        <p className="faq-sub">Keep your learning partner in the loop.</p>

        <div className="faq-layout">
          {/* steps */}
          <ol className="faq-steps">
            {STEPS.map((step) => (
              <li key={step.number} className="faq-step">
                <span className="faq-step-badge" aria-hidden="true">
                  {step.number}
                </span>
                <div className="faq-step-body">
                  <h2 className="faq-step-title">{step.title}</h2>
                  <p className="faq-step-text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* side actions */}
          <aside className="faq-aside">
            <button
              type="button"
              className="faq-btn faq-btn--soft"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              type="button"
              className="faq-btn faq-btn--soft"
              onClick={() => navigate("/help")}
            >
              All help topics
            </button>

            <div className="faq-help-card">
              <h2 className="faq-help-title">Still need a hand?</h2>
              <p className="faq-help-text">
                We’re here to help you learn and teach with confidence.
              </p>
            </div>

            <button
              type="button"
              className="faq-btn faq-btn--primary"
              onClick={() => navigate("/contact-support")}
            >
              Contact support
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
