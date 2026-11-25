import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/meeting-location.css";
import NavBar from "../components/NavBar";

const STORAGE_KEY = "skilltrade.meetingLocation.demo.v1";
const places = [
  { id: "mac", name: "Mac Hall, food court", instructions: "Meet by the Dairy Queen in Mac Hall." },
  { id: "tfdl", name: "TFDL, second floor", instructions: "Meet by the elevators on the second floor." },
];

function readSavedLocation() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (places.some((place) => place.id === saved)) return saved;
  } catch {
    // The form stays usable if browser storage is unavailable.
  }
  return "";
}

export default function MeetingLocation() {
  const [savedLocation, setSavedLocation] = useState(readSavedLocation);
  const [selectedId, setSelectedId] = useState(savedLocation);
  const [confirmed, setConfirmed] = useState(Boolean(savedLocation));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const successHeading = useRef(null);
  const radioRefs = useRef({});
  const selectedPlace = places.find((place) => place.id === selectedId);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Meeting location · SkillTrade";
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    if (confirmed) successHeading.current?.focus();
    else radioRefs.current[savedLocation]?.focus();
  }, [confirmed, savedLocation]);

  function chooseLocation(id) {
    setSelectedId(id);
    setError("");
    setSaveError("");
  }

  async function confirmLocation(event) {
    event.preventDefault();
    if (saving) return;
    if (!selectedPlace) {
      setError("Choose a meeting location before confirming.");
      radioRefs.current.mac.focus();
      return;
    }
    setSaving(true);
    setSaveError("");
    // Allow the saving label to appear before the local browser write.
    await new Promise((resolve) => setTimeout(resolve, 0));
    try {
      localStorage.setItem(STORAGE_KEY, selectedId);
      setSavedLocation(selectedId);
      setConfirmed(true);
    } catch {
      setSaveError("Couldn’t save the location. Your selection is still here—please try again.");
    } finally {
      setSaving(false);
    }
  }

  function changeLocation() {
    setConfirmed(false);
    setSaveError("");
  }

  // Pass this booking's details to the shared meetup page, without changing other sessions.
  const meetingSession = selectedPlace ? {
    partner: "Alex Morgan",
    firstName: "Alex",
    initials: "AM",
    role: "Teacher",
    skill: "Acoustic Guitar",
    placeName: selectedPlace.name,
    mapSubtitle: "University of Calgary · Indoors",
    landmark: selectedId === "mac" ? "Food court" : "Second floor",
    mapLabel: selectedId === "mac" ? "MAC HALL" : "TFDL",
  } : null;

  return (
    <div className="meeting-location-page">
      <NavBar points={120} initials="SM" />
      <main className="ml-main">
        <div className="ml-heading">
          <p className="eyebrow">A PLACE TO LEARN TOGETHER</p>
          <h1>Where will you meet?</h1>
          <p>Choose one of Alex’s approved locations for your in-person session.</p>
        </div>
        <div className="meeting-workspace">
          <section className="choice-panel" aria-label="Choose your meeting place">
            {confirmed ? (
              <section className="meeting-success" aria-labelledby="meeting-success-title">
                <span className="success-tick" aria-hidden="true">✓</span>
                <p className="eyebrow">MEETING LOCATION SAVED</p>
                <h2 id="meeting-success-title" ref={successHeading} tabIndex={-1}>You know where to meet.</h2>
                <p className="success-location">{selectedPlace.name}</p>
                <p className="success-instructions">{selectedPlace.instructions}</p>
                <p className="status-note">Saved in this browser only. No booking request has been sent.</p>
                <button className="secondary" type="button" onClick={changeLocation}>Change location</button>
                <Link className="secondary next-link" to="/location-shared" state={{ instructions: selectedPlace.instructions, meetingSession }}>
                  Continue to finding each other
                </Link>
              </section>
            ) : (
              <form className="meeting-form" noValidate onSubmit={confirmLocation}>
                <div className="choice-heading"><h2>Meeting locations</h2><span>{places.length} options</span></div>
                <fieldset disabled={saving} aria-invalid={Boolean(error)} aria-describedby={error ? "choice-error" : undefined}>
                  <legend className="ml-sr-only">Choose a meeting location</legend>
                  {places.map((place, index) => (
                    <label className="place-option" key={place.id}>
                      <input ref={(element) => { radioRefs.current[place.id] = element; }} type="radio" name="place" value={place.id} checked={selectedId === place.id} onChange={() => chooseLocation(place.id)} aria-label={place.name} />
                      <span className="place-body">
                        <span className="place-top"><span className="place-number">{String(index + 1).padStart(2, "0")}</span><span className="approved">Teacher approved</span></span>
                        <strong>{place.name}</strong>
                        <span className="place-meta">University of Calgary · Indoors</span>
                        <span className="instructions-label">MEETING INSTRUCTIONS</span>
                        <span className="instructions">{place.instructions}</span>
                      </span>
                      <span className="radio-mark" aria-hidden="true" />
                    </label>
                  ))}
                </fieldset>
                {error && <p id="choice-error" className="choice-error" role="alert">{error}</p>}
                <div className="choice-note"><b>Need a different meeting spot?</b><p>These are the locations Alex offers for this session. Choose an option you can attend.</p></div>
                <button type="submit" className="primary confirm-location" disabled={saving} aria-busy={saving}>{saving ? "Saving location…" : "Confirm meeting location"}</button>
                <p className={`status-note ${saveError ? "save-error" : ""}`} role="status">{saveError || "Your booking request won’t be sent from this preview."}</p>
              </form>
            )}
          </section>
          <aside className="booking-sidebar" aria-label="Booking preview">
            <section className="booking-card">
              <span className="eyebrow">YOUR SESSION</span>
              <div className="teacher-row"><span className="teacher-initials" aria-hidden="true">AM</span><div><h2>Acoustic Guitar</h2><p>with Alex Morgan</p></div></div>
              <dl><div><dt>Session format</dt><dd>In person</dd></div><div><dt>Duration</dt><dd>60 minutes</dd></div><div><dt>Skill-point cost</dt><dd>15 points</dd></div></dl>
              <div className="selected-location" aria-live="polite">
                <span className="eyebrow">MEETING PLACE</span>
                <h3>{selectedPlace ? selectedPlace.name : "Choose a location"}</h3>
                <p>{selectedPlace ? selectedPlace.instructions : "Your selected meeting spot and instructions will appear here."}</p>
              </div>
            </section>
            <section className="next-card">
              <h2>What happens next?</h2>
              <ol><li>Choose your meeting location.</li><li>Review your booking request.</li><li>Once accepted, find the details in Sessions.</li></ol>
              <p>This page previews the location step. Booking and payment are not connected.</p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
