import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/arrived.css";

const exampleSession = {
  partner: "Alex Morgan", firstName: "Alex", initials: "AM", role: "Teacher",
  skill: "Acoustic Guitar", placeName: "Mac Hall, food court",
  mapSubtitle: "University of Calgary · Indoors", landmark: "Food court", mapLabel: "MAC HALL",
};

export default function Arrived() {
  const location = useLocation();
  const session = location.state?.session || exampleSession;
  const instructions = location.state?.instructions || "Meet by the Dairy Queen in Mac Hall.";
  const [meetupConfirmed, setMeetupConfirmed] = useState(Boolean(location.state?.meetupConfirmed));
  const [confirming, setConfirming] = useState(false);
  const meetDialog = useRef(null);
  const foundButton = useRef(null);
  const heroHeading = useRef(null);
  // Carry the same session and arrival state back to the location view.
  const meetupState = {
    ...location.state, session, instructions, hasArrived: true, meetupConfirmed,
    meetingSession: location.state?.meetingSession || (location.state?.session ? undefined : exampleSession),
  };

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Arrived · SkillTrade";
    return () => { document.title = previousTitle; };
  }, []);

  function openConfirmation() {
    meetDialog.current.showModal();
  }

  function cancelConfirmation() {
    meetDialog.current.close();
    foundButton.current.focus();
  }

  async function confirmMeetup() {
    if (confirming) return;
    setConfirming(true);
    // Give the confirming label time to render before updating the preview.
    await new Promise((resolve) => setTimeout(resolve, 0));
    setMeetupConfirmed(true);
    setConfirming(false);
    meetDialog.current.close();
    heroHeading.current.focus();
  }

  return (
    <div className="arrived-page">
      <header className="ar-header">
        <div className="ar-header-inner">
          <Link className="ar-back" to="/location-shared" state={meetupState} aria-label="Back to meeting view">‹</Link>
          <Link className="ar-brand" to="/" aria-label="SkillTrade home">skill<span>Trade</span></Link>
          <nav className="ar-navigation" aria-label="Account navigation"><Link to="/profile">Profile</Link><Link to="/help">Help</Link></nav>
        </div>
      </header>
      <main className="ar-main">
        <div className="ar-heading">
          <p className="eyebrow">THE FIRST HELLO</p>
          <h1>You’ve arrived</h1>
          <p>Find your session partner, then confirm when you’re together.</p>
        </div>
        <div className="arrival-workspace">
          <section className="arrival-panel" aria-label="Arrival confirmation">
            <div className={`arrival-hero ${meetupConfirmed ? "confirmed" : ""}`}>
              <div className="arrival-icon" aria-hidden="true">✓</div>
              <span className="arrival-badge">{meetupConfirmed ? "Meetup confirmed" : "Your arrival is marked"}</span>
              <h2 ref={heroHeading} tabIndex={-1}>{meetupConfirmed ? "You found each other!" : "Ready to learn together?"}</h2>
              <p>{meetupConfirmed ? `You’re together at the meeting spot. Enjoy your session with ${session.firstName}.` : `You’re at the meeting spot. Look for ${session.firstName} and check the instructions below.`}</p>
            </div>
            <div className="participant-list">
              <div className="participant">
                <span className="person-circle you-avatar" aria-hidden="true">You</span>
                <div><h3>Your arrival</h3><p>Marked in this preview</p></div>
                <span className="participant-status">Arrived</span>
              </div>
              <div className="participant">
                <span className="person-circle" aria-hidden="true">{session.initials}</span>
                <div><h3>{session.partner}</h3><p>{meetupConfirmed ? `You confirmed meeting ${session.firstName}` : "Confirm when you’ve met in person"}</p></div>
                <span className={`participant-status ${meetupConfirmed ? "" : "pending"}`}>{meetupConfirmed ? "Met in person" : "Not confirmed"}</span>
              </div>
            </div>
            <div className="arrival-actions">
              <button ref={foundButton} className="primary" type="button" disabled={meetupConfirmed} onClick={openConfirmation}>{meetupConfirmed ? "Meetup confirmed" : "We found each other"}</button>
              <Link className="secondary location-link" to="/location-shared" state={meetupState}>View meeting location</Link>
              <p className="arrival-status" role="status">{meetupConfirmed ? "Confirmed in this preview. No attendance record or notification has been sent." : "Confirm only once you’re together at the meeting spot."}</p>
            </div>
            {meetupConfirmed && (
              <div className="ready-note"><h3>You’re ready to learn.</h3><p>Your meetup is confirmed in this demo. Enjoy the session, then leave a rating when you’re done.</p><Link className="secondary location-link" to="/session-started" state={meetupState}>{location.state?.finished ? "View completed session" : "Start the demo session"}</Link></div>
            )}
          </section>
          <aside className="arrival-sidebar" aria-label="Session and meeting details">
            <section className="session-summary">
              <span className="eyebrow">YOUR SESSION</span>
              <div className="session-title"><span className="person-circle" aria-hidden="true">{session.initials}</span><div><h2>{session.skill}</h2><p>with {session.partner}</p></div></div>
              <div className="summary-meta"><span>In person</span><span>60 minutes</span></div>
              <div className="meeting-details"><span className="eyebrow">WHERE YOU’RE MEETING</span><h3>{session.placeName}</h3><p>{instructions}</p></div>
            </section>
            <section className="arrival-help"><h2>Still looking for {session.firstName}?</h2><ol><li>Double-check the meeting instructions.</li><li>Open the location view to help find each other.</li><li>Confirm the meetup only once you’re together.</li></ol></section>
            <aside className="demo-callout"><b>Interactive preview</b><p>No attendance record or notification is sent. {session.firstName}’s arrival is not live.</p></aside>
          </aside>
        </div>
      </main>
      <dialog ref={meetDialog} aria-labelledby="meet-title" aria-describedby="meet-description" onCancel={(event) => { if (confirming) event.preventDefault(); }}>
        <h2 id="meet-title">Have you found {session.firstName}?</h2>
        <p id="meet-description">Confirm that you’re together at the meeting spot and ready for your session.</p>
        <div className="dialog-actions">
          <button className="secondary" type="button" disabled={confirming} onClick={cancelConfirmation} autoFocus>Not yet</button>
          <button className="primary" type="button" disabled={confirming} aria-busy={confirming} onClick={confirmMeetup}>{confirming ? "Confirming…" : "Yes, we’re together"}</button>
        </div>
      </dialog>
    </div>
  );
}
