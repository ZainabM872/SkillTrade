import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/session-started.css";

const exampleSession = {
  partner: "Alex Morgan", firstName: "Alex", initials: "AM", role: "Teacher",
  skill: "Acoustic Guitar", placeName: "Mac Hall, food court",
  mapSubtitle: "University of Calgary · Indoors", landmark: "Food court", mapLabel: "MAC HALL",
};

export default function SessionStarted() {
  const location = useLocation();
  const session = location.state?.session || exampleSession;
  const instructions = location.state?.instructions || "Meet by the Dairy Queen in Mac Hall.";
  const [finished, setFinished] = useState(Boolean(location.state?.finished));
  const [finishing, setFinishing] = useState(false);
  const finishDialog = useRef(null);
  const finishButton = useRef(null);
  const finishedPanel = useRef(null);
  const yourRole = session.role === "Teacher" ? "Learner" : "Teacher";
  const sessionState = {
    ...location.state, session, instructions, finished, meetupConfirmed: true, hasArrived: true,
    meetingSession: location.state?.meetingSession || (location.state?.session ? undefined : exampleSession),
  };

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Session started · SkillTrade";
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    if (finished) finishedPanel.current?.focus();
  }, [finished]);

  function openFinishDialog() {
    if (!finished) finishDialog.current.showModal();
  }

  function keepLearning() {
    finishDialog.current.close();
    finishButton.current.focus();
  }

  async function finishSession() {
    if (finishing || finished) return;
    setFinishing(true);
    // Render the finishing state before updating this local preview.
    await new Promise((resolve) => setTimeout(resolve, 0));
    setFinished(true);
    setFinishing(false);
    finishDialog.current.close();
  }

  return (
    <div className="session-started-page">
      <NavBar initials="SM" points={120} />
      <main className="ss-main">
        <Link className="flow-back" to="/help">Help</Link>
        <Link className="flow-back" to={session.format === "Online" ? "/sessions" : "/arrived"} state={sessionState} aria-label="Back to arrival details">← {session.format === "Online" ? "Back to sessions" : "Back to arrival details"}</Link>
        <div className="ss-heading">
          <p className="eyebrow">MAKE ROOM FOR SOMETHING NEW</p>
          <h1>{finished ? "A new skill, a little closer" : "Your session has started"}</h1>
          <p>{finished ? "Your demo session is complete. Take a moment to share how it went." : "You’ve found each other. Now it’s time to learn."}</p>
        </div>
        <div className="session-workspace">
          <section className="active-panel" aria-label="Session progress and actions">
            <div className={`session-hero ${finished ? "finished-hero" : ""}`}>
              <span className="session-badge">{finished ? "Session complete · Demo" : "Session in progress · Demo"}</span>
              <div className="session-symbol" aria-hidden="true">{finished ? "✓" : "✦"}</div>
              <h2>{finished ? "Nice work, you two." : session.skill}</h2>
              <p>{finished ? `Ready to reflect on your session with ${session.firstName}?` : "A little practice. A new skill to take with you."}</p>
              <div className="session-pair"><span className="person-chip">You · {yourRole}</span><span className="pair-divider" aria-hidden="true">＋</span><span className="person-chip">{session.firstName} · {session.role}</span></div>
            </div>
            <nav className="progress-track" aria-label="Session progress">
              <div className="progress-step completed"><span aria-hidden="true">✓</span><b>Met up</b></div>
              <div className="progress-line" aria-hidden="true" />
              <div className={`progress-step ${finished ? "completed" : "current"}`} aria-current={finished ? undefined : "step"}><span aria-hidden="true">{finished ? "✓" : "2"}</span><b>Learning</b></div>
              <div className="progress-line" aria-hidden="true" />
              <div className={`progress-step ${finished ? "current" : ""}`} aria-current={finished ? "step" : undefined}><span aria-hidden="true">3</span><b>Review</b></div>
            </nav>
            {!finished && <section className="during-note"><h3>Focus on the session</h3><p>Work at a pace that feels comfortable. When you’re done, finish the session and share how it went.</p></section>}
            <div className="finish-actions">
              <button ref={finishButton} className="primary" type="button" disabled={finished} onClick={openFinishDialog}>{finished ? "Session finished" : "Finish session"}</button>
              <p className="session-status" role="status">{finished ? "Completed in this preview only. No attendance record or points have changed." : "Finish only when your session is complete."}</p>
            </div>
            {finished && (
              <section className="finished-panel" ref={finishedPanel} tabIndex={-1} aria-labelledby="finished-heading">
                <h3 id="finished-heading">Ready to share your experience?</h3><p>Your demo session is complete. Rate the session experience on the next page.</p>
                <Link className="primary rating-link" to="/rate-session" state={sessionState}>Rate your session</Link>
              </section>
            )}
          </section>
          <aside className="session-sidebar" aria-label="Session details">
            <section className="details-card">
              <span className="eyebrow">SESSION DETAILS</span>
              <div className="teacher-row"><span className="teacher-avatar" aria-hidden="true">{session.initials}</span><div><h2>{session.partner}</h2><p>Your {session.role.toLowerCase()} · {session.skill}</p></div></div>
              <dl><div><dt>Format</dt><dd>{session.format || "In person"}</dd></div><div><dt>Scheduled duration</dt><dd>{session.durationMinutes || 60} minutes</dd></div><div><dt>Skill-point cost</dt><dd>{session.points ?? 15} points</dd></div></dl>
              <div className="meeting-summary"><span className="eyebrow">MEETING LOCATION</span><h3>{session.placeName}</h3><p>{instructions}</p></div>
            </section>
            <section className="after-card"><h2>After your session</h2><ol><li>Finish when you’re both done.</li><li>Share a star rating and optional feedback.</li><li>Complete any attendance and skill-point steps shown in the app.</li></ol></section>
            <aside className="preview-note"><b>Interactive preview</b><p>This page demonstrates session states. It does not track real attendance, transfer points, or notify {session.firstName}.</p></aside>
          </aside>
        </div>
      </main>
      <dialog ref={finishDialog} aria-labelledby="finish-title" aria-describedby="finish-description" onCancel={(event) => { if (finishing) event.preventDefault(); }}>
        <span className="dialog-eyebrow">WRAP UP YOUR SESSION</span><h2 id="finish-title">All finished learning?</h2><p id="finish-description">Confirm that your session with {session.firstName} is complete. You can leave your rating next.</p>
        <div className="dialog-actions">
          <button className="secondary" type="button" disabled={finishing} onClick={keepLearning} autoFocus>Keep learning</button>
          <button className="primary" type="button" disabled={finishing} aria-busy={finishing} onClick={finishSession}>{finishing ? "Finishing…" : "Yes, finish session"}</button>
        </div>
      </dialog>
    </div>
  );
}
