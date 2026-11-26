import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/meeting-location.css";
import NavBar from "../components/NavBar";

const STORAGE_KEY = "skilltrade.meetingLocation.demo.v1";
const examplePlaces = [
  { id: "mac", name: "Mac Hall, food court", instructions: "Meet by the Dairy Queen in Mac Hall." },
  { id: "tfdl", name: "TFDL, second floor", instructions: "Meet by the elevators on the second floor." },
];

function readSavedLocation(storageKey, places) {
  try {
    const saved = localStorage.getItem(storageKey);
    if (places.some((place) => place.id === saved)) return saved;
  } catch {
    // The form stays usable if browser storage is unavailable.
  }
  return "";
}

export default function MeetingLocation() {
  const route = useLocation();
  const booking = route.state?.booking;
  const places = booking?.meetingLocations?.length ? booking.meetingLocations.map((place, index) => ({
    id: String(index), name: place.name, instructions: place.note || place.instructions || "Check the meeting instructions.",
  })) : examplePlaces;
  const teacher = booking?.teacher_name || "Alex Morgan";
  const skill = booking?.title || "Acoustic Guitar";
  const storageKey = booking ? `${STORAGE_KEY}.${booking.listing_id}` : STORAGE_KEY;
  const [savedLocation, setSavedLocation] = useState(() => readSavedLocation(storageKey, places));
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
      radioRefs.current[places[0].id].focus();
      return;
    }
    setSaving(true);
    setSaveError("");
    // Allow the saving label to appear before the local browser write.
    await new Promise((resolve) => setTimeout(resolve, 0));
    try {
      localStorage.setItem(storageKey, selectedId);
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
    partner: teacher,
    firstName: teacher.split(" ")[0],
    initials: teacher.split(" ").map((part) => part[0]).slice(0, 2).join(""),
    role: "Teacher",
    skill,
    durationMinutes: booking?.duration_minutes || 60, points: booking?.point_cost ?? 15,
    // A listing can have many sessions; only forward an actual booking session ID.
    session_id: booking?.session_id, format: "In person",
    scheduledLabel: booking?.date ? `${booking.date} · ${booking.time}` : undefined,
    placeName: selectedPlace.name,
    mapSubtitle: booking ? "Example meeting spot" : "University of Calgary · Indoors",
    landmark: booking ? selectedPlace.name : selectedId === "mac" ? "Food court" : "Second floor",
    mapLabel: booking ? "MEETING SPOT" : selectedId === "mac" ? "MAC HALL" : "TFDL",
  } : null;

  return (
    <div className="meeting-location-page">
      <NavBar points={120} initials="SM" />
      <main className="ml-main">
        <Link className="flow-back" to="/help">Help</Link>
        <Link className="flow-back" to={booking ? `/booking?listing=${booking.listing_id}` : "/profile"} state={route.state} aria-label="Back to profile">← {booking ? "Back to booking" : "Back to profile"}</Link>
        <div className="ml-heading">
          <p className="eyebrow">A PLACE TO LEARN TOGETHER</p>
          <h1>Where will you meet?</h1>
          <p>{booking ? `Choose an example meeting spot for your session with ${teacher}. Locations are a preview, not supplied by the listing API.` : "Choose one of Alex’s approved locations for your in-person session."}</p>
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
                <Link className="secondary next-link" to="/location-shared" state={{ instructions: selectedPlace.instructions, meetingSession, booking }}>
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
                        <span className="place-top"><span className="place-number">{String(index + 1).padStart(2, "0")}</span><span className="approved">{booking ? "Example location" : "Teacher approved"}</span></span>
                        <strong>{place.name}</strong>
                        <span className="place-meta">{booking ? "Example meeting spot · In person" : "University of Calgary · Indoors"}</span>
                        <span className="instructions-label">MEETING INSTRUCTIONS</span>
                        <span className="instructions">{place.instructions}</span>
                      </span>
                      <span className="radio-mark" aria-hidden="true" />
                    </label>
                  ))}
                </fieldset>
                {error && <p id="choice-error" className="choice-error" role="alert">{error}</p>}
                <div className="choice-note"><b>Need a different meeting spot?</b><p>{booking ? "These sample locations demonstrate the booking flow. Your request is not sent." : "These are the locations Alex offers for this session. Choose an option you can attend."}</p></div>
                <button type="submit" className="primary confirm-location" disabled={saving} aria-busy={saving}>{saving ? "Saving location…" : "Confirm meeting location"}</button>
                <p className={`status-note ${saveError ? "save-error" : ""}`} role="status">{saveError || "Your booking request won’t be sent from this preview."}</p>
              </form>
            )}
          </section>
          <aside className="booking-sidebar" aria-label="Booking preview">
            <section className="booking-card">
              <span className="eyebrow">YOUR SESSION</span>
              <div className="teacher-row"><span className="teacher-initials" aria-hidden="true">AM</span><div><h2>{skill}</h2><p>with {teacher}</p></div></div>
              <dl><div><dt>Session format</dt><dd>In person</dd></div><div><dt>Duration</dt><dd>{booking?.duration_minutes || 60} minutes</dd></div><div><dt>Skill-point cost</dt><dd>{booking?.point_cost ?? 15} points</dd></div></dl>
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
