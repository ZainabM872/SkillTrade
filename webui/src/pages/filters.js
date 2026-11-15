import React, { useEffect, useRef, useState } from "react";
import "../styles/filters.css";

const GROUPS = [
  {
    key: "distance",
    label: "Distance",
    options: ["Current area", "5 km", "10 km", "25 km"],
  },
  {
    key: "sessionType",
    label: "Session type",
    options: ["Any", "In person", "Online", "Both"],
  },
  {
    key: "difficulty",
    label: "Difficulty",
    options: ["Any level", "Beginner", "Intermediate", "Advanced"],
  },
  {
    key: "timeOfDay",
    label: "Time of day",
    options: ["Any time", "Morning", "Afternoon", "Evening"],
  },
  {
    key: "rating",
    label: "Minimum rating",
    options: ["Any rating", "3+ stars", "4+ stars", "4.5+ stars"],
  },
  {
    key: "points",
    label: "Points per session",
    options: ["Any cost", "7.5 points", "15 points", "22.5 points"],
  },
  {
    key: "duration",
    label: "Duration",
    options: ["Any duration", "30 minutes", "60 minutes", "90 minutes"],
  },
];

// the first option of every group is its default
const DEFAULTS = Object.fromEntries(GROUPS.map((g) => [g.key, g.options[0]]));

/**
 * Filters popup (opened from the Filters button on the homepage).
 * Render it only while it should be open: {open && <Filters ... />}
 *   onClose()        – called for the X button, Escape, or a click on the dark backdrop
 *   onApply(values)  – called with e.g. { distance: "5 km", sessionType: "Online", ... }
 */
export default function FiltersPopup({ onClose, onApply }) {
  const [values, setValues] = useState(DEFAULTS);
  const closeRef = useRef(null);

  // focus the close button on open, and stop the page behind from scrolling
  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // close on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const choose = (key, option) =>
    setValues((current) => ({ ...current, [key]: option }));

  return (
    <div
      className="filters-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="filters-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
      >
        <div className="filters-header">
          <div>
            <h2 id="filters-title" className="filters-title">
              Find your kind of skill
            </h2>
            <p className="filters-sub">Refine your search</p>
          </div>
          <button
            type="button"
            ref={closeRef}
            className="filters-close"
            aria-label="Close filters"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {GROUPS.map((group) => (
          <div key={group.key} className="filters-group">
            <h3
              id={`filters-group-${group.key}`}
              className="filters-group-title"
            >
              {group.label}
            </h3>
            <div
              className="filters-options"
              role="group"
              aria-labelledby={`filters-group-${group.key}`}
            >
              {group.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`filters-option${
                    values[group.key] === option ? " is-selected" : ""
                  }`}
                  aria-pressed={values[group.key] === option}
                  onClick={() => choose(group.key, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="filters-actions">
          <button
            type="button"
            className="filters-btn filters-btn--soft"
            onClick={() => setValues(DEFAULTS)}
          >
            Reset
          </button>
          <button
            type="button"
            className="filters-btn filters-btn--primary"
            onClick={() => onApply(values)}
          >
            Show matching skills
          </button>
        </div>
      </div>
    </div>
  );
}
