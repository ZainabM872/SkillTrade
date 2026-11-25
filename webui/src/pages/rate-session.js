import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/rate-session.css";

// This key belongs to the example session on the completed-session page.
const STORAGE_KEY = "skilltrade.sessionRating.taylor-korean-2026-11-04.v1";
const ratingLabels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

function readSavedRating(storageKey) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Number.isInteger(saved.rating) && saved.rating >= 1 && saved.rating <= 5) {
      return {
        rating: saved.rating,
        comment: typeof saved.comment === "string" ? saved.comment.slice(0, 500) : "",
      };
    }
  } catch {
    // An empty form still works if browser storage is unavailable or damaged.
  }
  return null;
}

export default function RateSession() {
  const location = useLocation();
  const activeSession = location.state?.session;
  const session = activeSession || {
    partner: "Taylor Reed", firstName: "Taylor", initials: "TR", skill: "Conversational Korean",
  };
  // Keep each session's feedback separate from the existing Korean-session rating.
  const storageKey = activeSession ? `skilltrade.sessionRating.${session.ratingId || `${session.partner}.${session.skill}`}.v1` : STORAGE_KEY;
  const returnPath = location.state?.ratingReturnPath || (activeSession ? "/session-started" : "/completed-session-details");
  const returnState = { ...location.state, finished: true };
  const [savedRating, setSavedRating] = useState(() => readSavedRating(storageKey));
  const [rating, setRating] = useState(savedRating ? savedRating.rating : 0);
  const [comment, setComment] = useState(savedRating ? savedRating.comment : "");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(Boolean(savedRating));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const firstStar = useRef(null);
  const successHeading = useRef(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Rate your session · SkillTrade";
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    if (submitted) successHeading.current?.focus();
    else firstStar.current?.focus();
  }, [submitted]);

  function chooseRating(value) {
    setRating(value);
    setHoverRating(0);
    setError("");
    setSaveError("");
  }

  async function submitRating(event) {
    event.preventDefault();
    if (saving) return;
    if (!rating) {
      setError("Please choose a rating before submitting.");
      firstStar.current?.focus();
      return;
    }

    setSaving(true);
    setSaveError("");
    // Let the button show its saving state before writing to browser storage.
    await new Promise((resolve) => setTimeout(resolve, 0));
    const feedback = { rating, comment: comment.trim() };
    try {
      localStorage.setItem(storageKey, JSON.stringify(feedback));
      setSavedRating(feedback);
      setComment(feedback.comment);
      setSubmitted(true);
    } catch {
      setSaveError("Your rating couldn’t be saved. Your feedback is still here—please try again.");
    } finally {
      setSaving(false);
    }
  }

  function editRating() {
    setSubmitted(false);
    setHoverRating(0);
    setSaveError("");
  }

  return (
    <div className="rate-session-page">
      <NavBar initials="SM" points={120} />

      <main className="rs-main">
        <Link className="flow-back" to="/help">Help</Link>
        <Link className="flow-back" to={returnPath} state={returnState} aria-label="Back to completed session">← Back to completed session</Link>
        <div className="rs-heading">
          <p className="eyebrow">A MOMENT TO REFLECT</p>
          <h1>Rate your session</h1>
          <p>Your feedback helps the next learner choose with confidence.</p>
        </div>
        <div className="rating-workspace">
          <section className="review-panel" aria-label="Session feedback">
            {submitted ? (
              <div className="rating-success">
                <span className="success-icon" aria-hidden="true">✓</span>
                <p className="eyebrow">FEEDBACK SAVED</p>
                <h2 ref={successHeading} tabIndex={-1}>Thanks for sharing.</h2>
                <p>You rated your session with {session.firstName} {savedRating.rating} out of 5{savedRating.comment ? " and added a comment." : "."}</p>
                <p className="success-note">Your rating is saved on this device. It hasn’t been sent to {session.firstName} or published.</p>
                <div className="rs-success-actions">
                  <button type="button" className="secondary" onClick={editRating}>Edit your rating</button>
                  <Link className="primary" to={returnPath} state={returnState}>Back to session</Link>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={submitRating}>
                <div className="form-intro">
                  <span className="step-tag">YOUR EXPERIENCE</span>
                  <h2>How was your session with {session.firstName}?</h2>
                  <p>Rate the teaching and learning experience.</p>
                </div>
                <fieldset className="rating-field" disabled={saving} aria-invalid={Boolean(error)} aria-describedby={error ? "rating-help rating-error" : "rating-help"}>
                  <legend className="rs-sr-only">Choose a session rating</legend>
                  <div className="stars" onMouseLeave={() => setHoverRating(0)}>
                    {ratingLabels.map((label, index) => {
                      const value = index + 1;
                      return (
                        <label key={value} className={`star-choice ${(hoverRating || rating) >= value ? "lit" : ""}`} onMouseEnter={() => setHoverRating(value)}>
                          <input
                            ref={value === 1 ? firstStar : undefined}
                            type="radio"
                            name="rating"
                            value={value}
                            checked={rating === value}
                            onChange={() => chooseRating(value)}
                            aria-label={`${value} ${value === 1 ? "star" : "stars"} — ${label}`}
                          />
                          <span aria-hidden="true">★</span>
                        </label>
                      );
                    })}
                  </div>
                  <p id="rating-help" className="rating-help" aria-live="polite">
                    {rating ? `${rating} / 5 — ${ratingLabels[rating - 1]}` : "Choose 1–5 stars"}
                  </p>
                  {error && <p id="rating-error" className="rating-error" role="alert">{error}</p>}
                </fieldset>
                <div className="review-label">
                  <label htmlFor="session-review">Share a few words <span className="optional">(optional)</span></label>
                  <span id="review-count">{comment.length} / 500</span>
                </div>
                <textarea
                  id="session-review"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  maxLength={500}
                  rows={5}
                  disabled={saving}
                  placeholder="What worked well? What could have been better?"
                  aria-describedby="review-hint review-count"
                />
                <p id="review-hint" className="review-hint">Keep your feedback about the session. Avoid sharing personal contact details.</p>
                <div className="review-footer">
                  <button className="primary" type="submit" disabled={saving} aria-busy={saving}>
                    {saving ? "Saving your rating…" : "Submit rating"}
                  </button>
                  <p className="local-note">This preview saves your rating in this browser only.</p>
                  <p role="status" className="rating-error">{saveError}</p>
                </div>
              </form>
            )}
          </section>

          <aside className="session-sidebar" aria-label="Session information">
            <section className="session-card">
              <span className="step-tag">THE SESSION YOU’RE RATING</span>
              <div className="session-person">
                <div className="initials" aria-hidden="true">{session.initials}</div>
                <div><h2>{session.skill}</h2><p>with {session.partner}</p></div>
              </div>
              <div className="session-description">{activeSession ? session.placeName : "November 4, 2026 · 2:00 PM–3:00 PM"}</div>
              <div className="session-meta"><span>{activeSession ? session.format || "In person" : "Online"}</span><span>{session.durationMinutes || 60} minutes</span></div>
            </section>
            <section className="reliability-card" aria-labelledby="rating-reliability-title">
              <div className="reliability-heading">
                <h2 id="rating-reliability-title">Reliability</h2>
                <span className="separate-tag">Separate from your rating</span>
              </div>
              <p>Reliability reflects attendance and no-shows—not how you rate the teaching.</p>
              <p className="reliability-note">Your star rating reviews the session experience. Attendance is recorded separately.</p>
              <Link className="rs-reliability-link" to="/reliability-faq">How reliability works</Link>
            </section>
            <section className="feedback-guide">
              <h2>Helpful feedback is specific</h2>
              <p>You could mention the explanation, pace, or something new you learned.</p>
              <ol><li>Choose your star rating.</li><li>Add a comment if you’d like.</li><li>Review, then submit.</li></ol>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}