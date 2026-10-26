
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/completed-session-details.css";

export default function CompletedSessionDetails() {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState("5");
  const [review, setReview] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  function handleRatingSubmit(event) {
    event.preventDefault();
    setRatingSubmitted(true);
    setShowRatingForm(false);
  }

  return (
    <div className="completed-session-page">
      <header className="cs-header">
        <Link to="/" className="cs-brand" aria-label="SkillTrade home">
          <span className="cs-brand-icon" aria-hidden="true">✦</span>
          <span>SkillTrade</span>
        </Link>

        <nav className="cs-nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/sessions" className="cs-active-link">
            Sessions
          </NavLink>
          <NavLink to="/teach">Teach a skill</NavLink>
        </nav>

        <div className="cs-header-actions">
          <Link to="/profile" className="cs-points">
            <span aria-hidden="true">✦</span>
            <span>120 points</span>
          </Link>
          <Link
            to="/sessions"
            className="cs-notification"
            aria-label="View sessions"
            title="View sessions"
          >
            ♧
          </Link>
          <Link to="/profile" className="cs-avatar" aria-label="View profile">
            SM
          </Link>
        </div>
      </header>

      <main className="cs-main">
        <div className="cs-page-heading">
          <div className="cs-heading-copy">
            <p className="cs-status">COMPLETED · LEARNING</p>
            <h1>Conversational Korean with Taylor Reed</h1>
            <p className="cs-session-time">
              November 4, 2026 · 2:00 PM–3:00 PM
            </p>
          </div>

          <Link to="/sessions" className="cs-back-link">
            ← Back to sessions
          </Link>
        </div>

        {ratingSubmitted && (
          <div className="cs-feedback-message" role="status">
            <span>
              Thank you for your feedback! Your {rating}-star rating
              {review.trim() ? " and review" : ""} has been recorded in this
              page preview.
            </span>
            <button
              type="button"
              onClick={() => setRatingSubmitted(false)}
              aria-label="Dismiss confirmation"
            >
              ×
            </button>
          </div>
        )}

        <div className="cs-content-grid">
          <section className="cs-card cs-session-card">
            <div className="cs-illustration">
              <div className="cs-language-art" aria-hidden="true">
                <span className="cs-language-symbol">가</span>
                <span className="cs-language-sparkle">✦</span>
              </div>
              <p>LANGUAGES</p>
            </div>

            <div className="cs-session-content">
              <h2>Your meeting details</h2>
              <h3>Online · Session completed</h3>
              <p className="cs-thank-you">
                Thanks for making time to learn something new.
              </p>

              <div className="cs-participant-details">
                <p>
                  <strong>Taylor Reed</strong>
                  <span className="cs-rating-summary">
                    ★ 4.8
                  </span>
                </p>
                <p>60 minutes <span aria-hidden="true">·</span> 15 points</p>
              </div>

              {ratingSubmitted ? (
                <div className="cs-rating-complete">
                  <span aria-hidden="true">✓</span>
                  You've submitted your feedback.
                  <button
                    type="button"
                    className="cs-text-button"
                    onClick={() => {
                      setRatingSubmitted(false);
                      setShowRatingForm(true);
                    }}
                  >
                    Edit rating
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="cs-button cs-primary cs-full-button"
                  onClick={() => setShowRatingForm((current) => !current)}
                  aria-expanded={showRatingForm}
                >
                  {showRatingForm ? "Close rating form" : "Rate this session"}
                </button>
              )}

              {showRatingForm && (
                <form
                  className="cs-rating-form"
                  onSubmit={handleRatingSubmit}
                >
                  <h3>How was your session?</h3>

                  <label htmlFor="cs-rating">Your rating</label>
                  <select
                    id="cs-rating"
                    value={rating}
                    onChange={(event) => setRating(event.target.value)}
                  >
                    <option value="5">5 — Excellent</option>
                    <option value="4">4 — Very good</option>
                    <option value="3">3 — Good</option>
                    <option value="2">2 — Could be better</option>
                    <option value="1">1 — Poor</option>
                  </select>

                  <label htmlFor="cs-review">Written feedback (optional)</label>
                  <textarea
                    id="cs-review"
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                    placeholder="What did you enjoy about learning with Taylor?"
                    rows={4}
                    maxLength={1000}
                  />

                  <p className="cs-character-count">
                    {review.length}/1000 characters
                  </p>

                  <button type="submit" className="cs-button cs-primary">
                    Submit rating
                  </button>
                </form>
              )}

              <Link to="/explore" className="cs-button cs-secondary cs-full-button">
                Book another session
              </Link>
            </div>
          </section>

          <aside className="cs-card cs-support-card">
            <h2>Keep your SkillTrade experience positive</h2>
            <p className="cs-support-description">
              Your session is complete. If you haven't already, leave an
              honest rating based on your experience. Your feedback helps
              other members decide who to learn with.
            </p>

            <div className="cs-support-actions">
              <Link
                to="/contact-support"
                className="cs-button cs-secondary"
              >
                Report a problem
              </Link>
            </div>

            <div className="cs-help-section">
              <h3>Need help?</h3>
              <p>
                If something went wrong during your session, our support
                resources can help you understand what to do next.
              </p>
              <Link to="/help" className="cs-text-link">
                Visit Help Centre ↗
              </Link>
              <Link to="/guidelines" className="cs-text-link">
                Community guidelines ↗
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
