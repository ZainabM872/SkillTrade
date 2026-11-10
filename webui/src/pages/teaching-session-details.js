
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "../styles/teaching-session-details.css";

export default function TeachingSessionDetails() {
  const location = useLocation();
  const [instructions, setInstructions] = useState(
    location.state?.instructions || "Meet by the reception desk in the lobby."
  );
  const [editedInstructions, setEditedInstructions] = useState(instructions);
  const [isEditing, setIsEditing] = useState(false);
  const [hasArrived, setHasArrived] = useState(Boolean(location.state?.hasArrived));
  const [notice, setNotice] = useState("");

  function handleSaveInstructions(event) {
    event.preventDefault();
    setInstructions(editedInstructions.trim());
    setIsEditing(false);
    setNotice(
      "Instructions updated on this page. Connect the save action to your backend to persist the change."
    );
  }

  function handleArrival() {
    setHasArrived(true);
    setNotice(
      "Arrival marked on this page. Connect this action to your backend to notify your learning partner."
    );
  }

  return (
    <div className="teaching-session-page">
      <header className="ts-header">
        <Link to="/" className="ts-brand" aria-label="SkillTrade home">
          <span className="ts-brand-icon" aria-hidden="true">✦</span>
          <span>SkillTrade</span>
        </Link>

        <nav className="ts-nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/sessions" className="ts-active-link">
            Sessions
          </NavLink>
          <NavLink to="/teach">Teach a skill</NavLink>
        </nav>

        <div className="ts-header-actions">
          <Link to="/profile" className="ts-points">
            <span aria-hidden="true">✦</span>
            <span>120 points</span>
          </Link>
          <Link
            to="/sessions"
            className="ts-notification"
            aria-label="View sessions"
            title="View sessions"
          >
            ♧
          </Link>
          <Link to="/profile" className="ts-avatar" aria-label="View profile">
            SM
          </Link>
        </div>
      </header>

      <main className="ts-main">
        <div className="ts-page-heading">
          <div>
            <p className="ts-status">CONFIRMED · TEACHING</p>
            <h1>Skating basics with Sara Moon</h1>
            <p className="ts-date">
              November 15, 2026 · 11:00 AM–12:00 PM
            </p>
          </div>

          <Link to="/sessions" className="ts-back-link">
            ← Back to sessions
          </Link>
        </div>

        {notice && (
          <div className="ts-notice" role="status">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        <div className="ts-content-grid">
          <section className="ts-card ts-meeting-card">
            <div className="ts-illustration">
              <div className="ts-skate-circle" aria-hidden="true">
                <span>⛸</span>
              </div>
              <p>SPORTS &amp; MOVEMENT</p>
            </div>

            <div className="ts-section-content">
              <h2>Your meeting details</h2>

              <div className="ts-detail-block">
                <h3>Community centre lobby · Calgary</h3>
                <p>{instructions}</p>
              </div>

              <div className="ts-participant">
                <p><strong>Sara Moon</strong> · Learner</p>
                <p>60 minutes <span aria-hidden="true">·</span> 15 points</p>
              </div>

              {isEditing ? (
                <form
                  className="ts-instructions-form"
                  onSubmit={handleSaveInstructions}
                >
                  <label htmlFor="meeting-instructions">
                    Meeting instructions
                  </label>
                  <textarea
                    id="meeting-instructions"
                    value={editedInstructions}
                    onChange={(event) =>
                      setEditedInstructions(event.target.value)
                    }
                    rows={3}
                    maxLength={500}
                    required
                  />
                  <div className="ts-inline-actions">
                    <button type="submit" className="ts-button ts-primary">
                      Save instructions
                    </button>
                    <button
                      type="button"
                      className="ts-button ts-secondary"
                      onClick={() => {
                        setEditedInstructions(instructions);
                        setIsEditing(false);
                      }}
                    >
                      Cancel edit
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  className="ts-button ts-secondary ts-edit-button"
                  onClick={() => {
                    setEditedInstructions(instructions);
                    setIsEditing(true);
                  }}
                >
                  Edit meeting instructions
                </button>
              )}

              <div className="ts-action-row">
                <button
                  type="button"
                  className="ts-button ts-primary"
                  onClick={handleArrival}
                  disabled={hasArrived}
                >
                  {hasArrived ? "✓ Arrival marked" : "I've arrived"}
                </button>

                <Link
                  className="ts-button ts-secondary"
                  to="/location-shared"
                  state={{ instructions, hasArrived }}
                >
                  Share / view location
                </Link>
              </div>
            </div>
          </section>

          <aside className="ts-card ts-plan-card">
            <h2>Keep your plans up to date</h2>
            <p className="ts-plan-description">
              Need to make a change? Give your learning partner at least
              48 hours' notice whenever possible.
            </p>

            <div className="ts-plan-actions">
              <Link to="/contact-support" className="ts-button ts-secondary">
                Reschedule session
              </Link>
              <Link to="/contact-support" className="ts-button ts-secondary">
                Cancel session
              </Link>
              <Link to="/contact-support" className="ts-button ts-secondary">
                Report a problem
              </Link>
            </div>

            <div className="ts-reliability">
              <h3>Need help?</h3>
              <p>
                If your plans change or something goes wrong, contact support
                for help with your session.
              </p>
              <Link to="/help" className="ts-text-link">
                Visit Help Centre ↗
              </Link>
              <Link to="/guidelines" className="ts-text-link">
                Community guidelines ↗
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
