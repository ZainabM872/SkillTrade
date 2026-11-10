import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/location-shared.css";

export default function LocationShared() {
  const location = useLocation();
  const navigate = useNavigate();
  // Booking and teaching sessions pass their own meeting details to this shared view.
  const meetingSession = location.state?.meetingSession;
  const session = meetingSession || {
    partner: "Sara Moon", firstName: "Sara", initials: "SM", role: "Learner",
    skill: "Skating basics", placeName: "Community centre lobby",
    mapSubtitle: "Calgary", landmark: "Reception", mapLabel: "LOBBY",
  };
  const instructions = location.state?.instructions || "Meet by the reception desk in the lobby.";
  const [sharing, setSharing] = useState(location.state?.sharing ?? true);
  const [selectedMarker, setSelectedMarker] = useState("meeting");
  const hasArrived = Boolean(location.state?.hasArrived);
  const meetupConfirmed = Boolean(location.state?.meetupConfirmed);
  const stopDialog = useRef(null);
  const sharingButton = useRef(null);

  const markerDetails = {
    meeting: { title: "Your meeting spot", copy: instructions },
    partner: { title: session.partner, copy: "Sample session partner position near the meeting spot. This is not a live location." },
    you: { title: "Your sample position", copy: "This marker demonstrates what sharing looks like. Your device location is not being used." },
  };
  const selectedDetail = markerDetails[selectedMarker];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Location shared · SkillTrade";
    return () => { document.title = previousTitle; };
  }, []);

  function changeSharing() {
    if (sharing) {
      stopDialog.current.showModal();
    } else {
      setSharing(true);
      setSelectedMarker("meeting");
    }
  }

  function closeDialog() {
    stopDialog.current.close();
    sharingButton.current.focus();
  }

  function stopSharing() {
    setSharing(false);
    setSelectedMarker("meeting");
    closeDialog();
  }

  function markArrival() {
    navigate("/arrived", {
      state: { session, meetingSession, instructions, hasArrived: true, meetupConfirmed, sharing },
    });
  }

  return (
    <div className="location-shared-page">
      <header className="ls-header">
        <div className="ls-header-inner">
          <Link className="ls-back" to={meetingSession ? "/meeting-location" : "/teaching-session-details"} state={{ instructions, hasArrived, meetingSession }} aria-label={meetingSession ? "Back to meeting location" : "Back to session details"}>‹</Link>
          <Link className="ls-brand" to="/" aria-label="SkillTrade home">skill<span>Trade</span></Link>
          <nav className="ls-navigation" aria-label="Account navigation">
            <Link to="/profile">Profile</Link>
            <Link to="/help">Help</Link>
          </nav>
        </div>
      </header>

      <main className="ls-main">
        <div className="ls-heading">
          <p className="eyebrow">A LITTLE CLOSER TO HELLO</p>
          <h1>Find each other</h1>
          <p>Your meeting spot and sharing controls, together in one place.</p>
        </div>
        <div className="sharing-workspace">
          <section className="map-panel" aria-labelledby="map-title">
            <div className="map-header">
              <div><h2 id="map-title">Meeting view</h2><p>{session.placeName} · {session.mapSubtitle}</p></div>
              <span className={`sharing-badge ${sharing ? "" : "paused"}`} role="status">
                {sharing ? "Demo sharing on" : "Sharing off"}
              </span>
            </div>
            <div className="meeting-map" role="group" aria-label="Illustrative meeting view. Markers are sample positions, not a real map.">
              <div className="map-grid" aria-hidden="true" />
              <div className="walkway" aria-hidden="true" />
              <span className="map-label reception">{session.landmark}</span>
              <span className="map-label entrance">Main entrance</span>
              <span className="map-label lobby">{session.mapLabel}</span>
              <div className="map-route" aria-hidden="true" />
              <button type="button" className={`map-marker partner-marker ${selectedMarker === "partner" ? "selected" : ""}`} disabled={!sharing} onClick={() => setSelectedMarker("partner")} aria-pressed={selectedMarker === "partner"}>
                <span className="marker-avatar" aria-hidden="true">{session.initials}</span><span>{session.firstName}</span>
              </button>
              <button type="button" className={`map-marker me ${selectedMarker === "you" ? "selected" : ""}`} disabled={!sharing} onClick={() => setSelectedMarker("you")} aria-pressed={selectedMarker === "you"}>
                <span className="you-dot" aria-hidden="true" /><span>You</span>
              </button>
              <button type="button" className={`map-marker meeting ${selectedMarker === "meeting" ? "selected" : ""}`} disabled={!sharing} onClick={() => setSelectedMarker("meeting")} aria-pressed={selectedMarker === "meeting"}>
                <span className="meeting-dot" aria-hidden="true">⌖</span><span>Meeting spot</span>
              </button>
              <span className="map-caption">Illustrative preview · Not a live map</span>
              {!sharing && (
                <div className="paused-cover"><b>Your location is hidden</b><span>The meeting spot is still available below.</span></div>
              )}
            </div>
            <div className="marker-detail" role="status">
              <span className="detail-symbol" aria-hidden="true">⌖</span>
              <div><h3>{selectedDetail.title}</h3><p>{selectedDetail.copy}</p></div>
            </div>
            <div className="map-legend" aria-label="Marker legend">
              <span><i className="legend-you" aria-hidden="true" />You</span>
              <span><i className="legend-partner" aria-hidden="true" />{session.firstName}</span>
              <span><i className="legend-meeting" aria-hidden="true" />Meeting spot</span>
            </div>
          </section>

          <aside className="meeting-sidebar" aria-label="Meeting and sharing controls">
            <section className="sharing-card" aria-labelledby="sharing-title">
              <div className="card-eyebrow">LOCATION SHARING</div>
              <h2 id="sharing-title">{sharing ? `Shared with ${session.firstName}` : "Your location is private"}</h2>
              <p>{sharing ? `In this demo, ${session.firstName} can see your sample position while you find each other.` : "Your sample position is hidden. You can still use the meeting instructions to find the right spot."}</p>
              <div className="privacy-line"><span aria-hidden="true">◈</span><span>Only for the person in this session</span></div>
              <button ref={sharingButton} className="secondary stop-sharing" type="button" onClick={changeSharing}>
                {sharing ? "Stop sharing" : "Share location again"}
              </button>
              <p className="demo-note">Demo only. No device location is accessed or sent.</p>
            </section>
            <section className="meeting-card" aria-labelledby="meeting-place-title">
              <span className="card-eyebrow">YOUR MEETING PLACE</span>
              <h2 id="meeting-place-title">{session.placeName}</h2>
              <p className="meeting-instruction">{instructions}</p>
              <div className="session-line">
                <span className="initials" aria-hidden="true">{session.initials}</span>
                <div><b>{session.partner} · {session.role}</b><span>{session.skill} · In person</span></div>
              </div>
              <button type="button" className="primary arrival-button" onClick={markArrival}>
                {hasArrived ? "View arrival details" : "I’ve arrived"}
              </button>
              <p className="arrival-status" role="status">
                {hasArrived ? `Arrival marked in this preview. No notification has been sent to ${session.firstName}.` : "Mark your arrival when you reach the meeting spot."}
              </p>
            </section>
            <section className="help-note">
              <h2>Can’t find each other?</h2>
              <p>Check the meeting instructions first. Select a marker in the preview to see who or where it represents.</p>
            </section>
          </aside>
        </div>
      </main>

      <dialog ref={stopDialog} aria-labelledby="stop-sharing-title" aria-describedby="stop-sharing-description">
        <h2 id="stop-sharing-title">Stop sharing your location?</h2>
        <p id="stop-sharing-description">Your sample position will be hidden. You can turn sharing back on whenever you need it.</p>
        <div className="dialog-actions">
          <button className="secondary" type="button" onClick={closeDialog} autoFocus>Keep sharing</button>
          <button className="primary" type="button" onClick={stopSharing}>Stop sharing</button>
        </div>
      </dialog>
    </div>
  );
}
