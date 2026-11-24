import React, { useEffect, useId, useRef, useState } from "react";
import "../styles/teaching-locations.css";
import NavBar from "../components/NavBar";

const STORAGE_KEY = "skilltrade.teachingLocations.v1";
const emptyLocation = () => ({ name: "", note: "" });

function readLocations() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(value)) {
      const valid = value.filter((item) => item && typeof item.name === "string")
        .slice(0, 30).map((item) => ({ name: item.name, note: typeof item.note === "string" ? item.note : "" }));
      if (valid.length) return valid;
    }
  } catch { /* A fresh form remains usable when browser storage is unavailable. */ }
  return [emptyLocation()];
}

function LocationFields({ location, number, removable, onChange, onRemove, error, onBlur, inputRef }) {
  const id = useId();
  return (
    <fieldset className="tl-location-card">
      <legend className="tl-sr-only">Teaching location {number}</legend>
      <div className="tl-card-heading">
        <span className="tl-number" aria-hidden="true">{String(number).padStart(2, "0")}</span>
        <h3>Location {number}</h3>
        {removable && <button className="tl-remove" type="button" onClick={onRemove} aria-label={`Remove location ${number}`}>Remove</button>}
      </div>
      <label htmlFor={`${id}-name`}>Location name</label>
      <input ref={inputRef} id={`${id}-name`} value={location.name} maxLength={100}
        onChange={(event) => onChange("name", event.target.value)} onBlur={onBlur}
        placeholder="e.g. Mac Hall, food court" autoComplete="off"
        aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
      {error && <p className="tl-error" id={`${id}-error`}>{error}</p>}
      <label htmlFor={`${id}-note`}>Meeting instructions <span className="tl-optional">(optional)</span></label>
      <textarea id={`${id}-note`} value={location.note} maxLength={400} rows={3}
        onChange={(event) => onChange("note", event.target.value)}
        placeholder="Where exactly should the learner meet you?" aria-describedby={`${id}-hint`} />
      <p className="tl-field-hint" id={`${id}-hint`}>A specific spot makes the first hello easier.</p>
    </fieldset>
  );
}

export default function TeachingLocations() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Teaching locations · SkillTrade";
    return () => { document.title = previousTitle; };
  }, []);
  const [saved, setSaved] = useState(readLocations);
  const nextId = useRef(saved.length);
  const [locations, setLocations] = useState(() => saved.map((item, id) => ({ ...item, id })));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("Changes are saved only in this browser.");
  const inputRefs = useRef({});
  const lastAdded = useRef(null);
  const values = locations.map(({ name, note }) => ({ name, note }));
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);
  const preview = locations.filter((item) => item.name.trim());
  const errorMessage = "Enter a location name so learners know where to meet.";

  function edit(id, field, value) {
    setLocations((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item));
    if (field === "name") setErrors((old) => ({ ...old, [id]: value.trim() ? "" : old[id] }));
    setMessage("Unsaved changes.");
  }
  function addLocation() {
    const id = nextId.current++;
    lastAdded.current = id;
    setLocations((items) => [...items, { ...emptyLocation(), id }]);
    setMessage("New location added. Enter a name, then save.");
  }
  function removeLocation(id) {
    const remaining = locations.filter((item) => item.id !== id);
    setLocations(remaining);
    setMessage("Location removed. Save to apply your changes.");
    inputRefs.current[remaining[0].id]?.focus();
  }
  function discard() {
    setLocations(saved.map((item) => ({ ...item, id: nextId.current++ })));
    setErrors({});
    setMessage("Changes discarded.");
  }
  async function save(event) {
    event.preventDefault();
    if (!dirty || saving) return;
    const invalid = locations.filter((item) => !item.name.trim());
    if (invalid.length) {
      setErrors(Object.fromEntries(invalid.map((item) => [item.id, errorMessage])));
      setMessage("Please fix the highlighted location names.");
      inputRefs.current[invalid[0].id]?.focus();
      return;
    }
    setSaving(true);
    setMessage("Saving locations on this device…");
    // Yield so assistive technology can observe the busy state during the local write.
    await new Promise((resolve) => setTimeout(resolve, 0));
    const clean = values.map((item) => ({ name: item.name.trim(), note: item.note.trim() }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      setSaved(clean);
      setLocations((items) => items.map((item, index) => ({ ...item, ...clean[index] })));
      setErrors({});
      setMessage("Locations saved on this device.");
    } catch {
      setMessage("Couldn’t save. Your changes are still here—please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="teaching-locations-page">
      <NavBar points={120} initials="SM" />
      <main className="tl-main">
        <div className="tl-heading"><p className="tl-eyebrow">MAKE IT EASY TO MEET</p><h1>Teaching locations</h1><p>Choose where you’re happy to teach. Learners pick a location when booking.</p></div>
        <div className="tl-layout">
          <form noValidate onSubmit={save} aria-label="Teaching locations">
            <div className="tl-section-heading"><h2>Meeting locations</h2><span>{locations.length} location{locations.length !== 1 && "s"}</span></div>
            <fieldset className="tl-fields" disabled={saving}><legend className="tl-sr-only">Your meeting locations</legend>
              {locations.map((location, index) => <LocationFields key={location.id} location={location} number={index + 1}
                removable={locations.length > 1} error={errors[location.id]}
                onChange={(field, value) => edit(location.id, field, value)} onRemove={() => removeLocation(location.id)}
                onBlur={() => { if (!location.name.trim()) setErrors((old) => ({ ...old, [location.id]: errorMessage })); }}
                inputRef={(element) => { inputRefs.current[location.id] = element; if (element && lastAdded.current === location.id) { lastAdded.current = null; element.focus(); } }} />)}
              <button className="tl-add" type="button" onClick={addLocation}>＋ Add another location</button>
            </fieldset>
            <aside className="tl-note"><h2>A clear meeting point helps</h2><p>Choose a public place and include a floor, entrance, or landmark so learners can find you.</p></aside>
            <div className="tl-save-actions"><button className="tl-secondary" type="button" disabled={!dirty || saving} onClick={discard}>Discard changes</button><button className="tl-primary" type="submit" disabled={!dirty || saving} aria-busy={saving}>{saving ? "Saving…" : "Save locations"}</button></div>
            <p className="tl-status" role="status">{message}</p>
          </form>
          <aside className="tl-preview" aria-labelledby="tl-preview-title"><div className="tl-preview-heading"><p className="tl-eyebrow">LEARNER VIEW</p><span>Live preview</span></div><h2 id="tl-preview-title">Where will we meet?</h2><p className="tl-preview-intro">Here’s how your meeting locations will appear when a learner books.</p>
            {!preview.length && <p className="tl-empty">Add a location name to see your learner preview.</p>}
            {preview.map((item) => <article className="tl-preview-choice" key={item.id}><span className="tl-preview-radio" aria-hidden="true" /><div><h3>{item.name.trim()}</h3><p>{item.note.trim() || "Meeting instructions will appear here."}</p></div></article>)}
            <p className="tl-preview-footnote">The learner chooses one of these locations for their session.</p>
            <div className="tl-flow-note"><h3>What happens next</h3><ol><li>You save your meeting locations.</li><li>A learner picks a spot when booking.</li><li>You both see the meeting instructions.</li></ol></div>
          </aside>
        </div>
      </main>
    </div>
  );
}
