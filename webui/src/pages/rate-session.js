import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/rate-session.css";

const ratingLabels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

async function readApi(url, options = {}) {
  const response = await fetch(url, { credentials: "same-origin", ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Couldn’t load or save your rating. Please try again.");
  return data;
}

// Remount when the session changes so one session's draft cannot appear in another.
export default function RateSession() {
  const location = useLocation();
  const queryId = new URLSearchParams(location.search).get("sessionId");
  const stateId = location.state?.sessionId ?? location.state?.session?.session_id;
  const sessionId = queryId ?? (stateId == null ? "" : String(stateId));
  return <RatingPage key={sessionId} sessionId={sessionId} />;
}

function RatingPage({ sessionId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeSession = location.state?.session;
  const [session, setSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retry, setRetry] = useState(0);
  const returnPath = location.state?.ratingReturnPath || (activeSession ? "/session-started" : sessionId ? "/sessions" : "/completed-session-details");
  const returnState = { ...location.state, finished: true };
  const [savedRating, setSavedRating] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const firstStar = useRef(null);
  const successHeading = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        if (!sessionId) {
          const data = await readApi("/api/rating-sessions");
          if (!cancelled) setSessions(data.sessions);
        } else {
          if (!/^[1-9]\d{0,18}$/.test(sessionId) || (sessionId.length === 19 && sessionId > "9223372036854775807")) {
            throw new Error("Choose a completed session using its database session ID.");
          }
          const details = await readApi(`/api/rating-sessions/${sessionId}`);
          const data = await readApi(`/api/sessions/${sessionId}/rating`);
          if (cancelled) return;
          const item = details.session;
          setSession({
            partner: item.partner, firstName: item.partner.split(" ")[0],
            initials: item.partner.split(" ").map(part => part[0]).slice(0, 2).join(""),
            skill: item.skill, format: item.mode === "online" ? "Online" : "In person",
            durationMinutes: item.duration_minutes,
            scheduledLabel: new Date(item.start_time).toLocaleString(),
          });
          setSavedRating(data.review);
          setRating(data.review?.rating || 0);
          setComment(data.review?.comment || "");
          setSubmitted(Boolean(data.review));
        }
      } catch (problem) {
        if (!cancelled) setLoadError(problem.message || "Couldn’t load your session. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [sessionId, retry]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Rate your session · SkillTrade";
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    if (submitted) successHeading.current?.focus();
    else firstStar.current?.focus();
  }, [submitted, loading]);

  function chooseRating(value) {
    setRating(value);
    setHoverRating(0);
    setError("");
    setSaveError("");
  }

  async function submitRating(event) {
    event.preventDefault();
    if (saving || loading || !session || loadError) return;
    if (!rating) {
      setError("Please choose a rating before submitting.");
      firstStar.current?.focus();
      return;
    }

    setSaving(true);
    setSaveError("");
    const feedback = { rating, comment: comment.trim() };
    try {
      const data = await readApi(`/api/sessions/${sessionId}/rating`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-SkillTrade-Request": "1" },
        body: JSON.stringify(feedback),
      });
      setSavedRating(data.review);
      setComment(data.review.comment || "");
      setSubmitted(true);
    } catch (problem) {
      setSaveError(`${problem.message || "Your rating couldn’t be saved."} Your feedback is still here—please try again.`);
    } finally {
      setSaving(false);
    }
  }

  function editRating() {
    setSubmitted(false);
    setHoverRating(0);
    setSaveError("");
  }

  if (loading || loadError || !session) {
    return (
      <div className="rate-session-page">
        <NavBar initials="SM" points={120} />
        <main className="rs-main">
          <Link className="flow-back" to={returnPath} state={returnState} aria-label={returnPath === "/sessions" ? "Back to sessions" : "Back to completed session"}>← {returnPath === "/sessions" ? "Back to sessions" : "Back to completed session"}</Link>
          <div className="rs-heading"><p className="eyebrow">A MOMENT TO REFLECT</p><h1>Rate your session</h1></div>
          <section className="review-panel">
            {loading ? <p role="status">Loading your completed sessions…</p> : loadError ? <>
              <p role="alert">{loadError}</p>
              <button className="secondary" onClick={() => setRetry(value => value + 1)}>Try again</button>
              <Link className="flow-back" to="/login">Log in</Link>
            </> : <>
              <h2>Choose a completed session</h2>
              <p>Select the session you’d like to rate. Only completed sessions saved to your account appear here.</p>
              {sessions.length ? <ul className="rating-session-list">{sessions.map(item => (
                <li key={item.session_id}><button className="secondary" onClick={() => navigate(`/rate-session?sessionId=${item.session_id}`, { state: location.state })}>
                  {item.skill} with {item.partner} · {new Date(item.start_time).toLocaleString()}
                </button></li>
              ))}</ul> : <p>No completed sessions are available to rate yet.</p>}
            </>}
          </section>
          <Link className="rs-reliability-link" to="/reliability-faq">How reliability works</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="rate-session-page">
      <NavBar initials="SM" points={120} />

      <main className="rs-main">
        <Link className="flow-back" to="/help">Help</Link>
        <Link className="flow-back" to={returnPath} state={returnState} aria-label={returnPath === "/sessions" ? "Back to sessions" : "Back to completed session"}>← {returnPath === "/sessions" ? "Back to sessions" : "Back to completed session"}</Link>
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
                <p className="success-note">Your rating is saved to your account.</p>
                {savedRating.status === "hidden" && <p>This review has been hidden by a moderator and cannot be edited.</p>}
                <div className="rs-success-actions">
                  <button type="button" className="secondary" onClick={editRating} disabled={savedRating.status === "hidden"}>Edit your rating</button>
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
                  <p className="local-note">Your rating is saved securely to your account.</p>
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
              <div className="session-description">{session.scheduledLabel}</div>
              <div className="session-meta"><span>{session.format}</span><span>{session.durationMinutes || 60} minutes</span></div>
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