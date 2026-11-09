
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/contact-support.css";

const topics = ["Booking", "Points", "Safety", "Other"];

export default function ContactSupport() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("Booking");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !message.trim()) {
      setError("Please enter your email and a message.");
      return;
    }

    // TODO: Send the support request to your backend here.
    // Navigate only after the backend confirms successful submission.
    navigate("/support-sent");
  }

  return (
    <div className="contact-support-page">
      <header className="contact-support-header">
        <Link
          to="/"
          className="contact-support-brand"
          aria-label="SkillTrade home"
        >
          <span className="contact-support-brand-icon" aria-hidden="true">
            ✦
          </span>
          <span>SkillTrade</span>
        </Link>

        <nav className="contact-support-nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/sessions">Sessions</NavLink>
          <NavLink to="/teach">Teach a skill</NavLink>
        </nav>

        <div className="contact-support-header-actions">
          <Link
            to="/profile"
            className="contact-support-points"
            aria-label="View your profile and points"
          >
            <span aria-hidden="true">✦</span>
            120 points
          </Link>

          <Link
            to="/sessions"
            className="contact-support-notifications"
            aria-label="View your sessions and notifications"
            title="Sessions"
          >
            <span aria-hidden="true">♧</span>
          </Link>

          <Link
            to="/profile"
            className="contact-support-avatar"
            aria-label="Go to your profile"
          >
            SM
          </Link>
        </div>
      </header>

      <main className="contact-support-main">
        <div className="contact-support-intro">
          <p className="contact-support-eyebrow">WE’RE HERE TO HELP</p>
          <h1>Contact support</h1>
          <p className="contact-support-description">
            Tell us what happened so we can help with your SkillTrade
            experience.
          </p>
        </div>

        <div className="contact-support-layout">
          <section className="contact-support-card">
            <h2>What can we help with?</h2>

            <form onSubmit={handleSubmit}>
              <fieldset className="contact-support-topics">
                <legend className="sr-only">Choose a support topic</legend>

                {topics.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`contact-support-topic ${
                      topic === item ? "selected" : ""
                    }`}
                    aria-pressed={topic === item}
                    onClick={() => setTopic(item)}
                  >
                    {item}
                  </button>
                ))}
              </fieldset>

              <div className="contact-support-field">
                <label htmlFor="support-email">Your email</label>
                <input
                  id="support-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="contact-support-field">
                <label htmlFor="support-message">Message</label>
                <textarea
                  id="support-message"
                  name="message"
                  placeholder="Tell us about your session or question…"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={6}
                  maxLength={3000}
                  required
                />
                <p className="contact-support-character-count">
                  {message.length}/3000 characters
                </p>
              </div>

              {error && (
                <p className="contact-support-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="contact-support-submit">
                Send message
              </button>
            </form>
          </section>

          <aside className="contact-support-sidebar">
            <div className="contact-support-help-card">
              <h2>Keep it helpful</h2>
              <p>
                Include the session date and skill name when relevant.
                Avoid sharing someone else’s private information.
              </p>
            </div>

            <div className="contact-support-help-card">
              <h2>Looking for a quick answer?</h2>
              <p>
                Browse common questions before sending your request.
              </p>
              <Link to="/help" className="contact-support-secondary-link">
                Visit Help Centre
              </Link>
            </div>

            <p className="contact-support-back-link">
              <Link to="/profile">Back to profile</Link>
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
