
import React from "react";
import { Link } from "react-router-dom";
import "../styles/community-guidelines.css"

const guidelines = [
  "Be respectful and inclusive.",
  "Only list and teach genuine skills.",
  "Meet safely in agreed public or approved locations.",
  "Show up as scheduled, or cancel / reschedule at least 48 hours in advance.",
  "No harassment, discrimination, scams, spam, or inappropriate content.",
  "Respect privacy. Never misuse shared location or contact information.",
  "Ratings and reliability reports must reflect real sessions.",
  "Report unsafe or inappropriate behavior.",
];

export default function Main() {
  return (
    <div className="skilltrade-guidelines">
      <header className="guidelines-header">
        <nav className="guidelines-nav" aria-label="Main navigation">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <a href="/explore" className="nav-link">Explore</a>
            <a href="/sessions" className="nav-link">Sessions</a>
            <a href="/teach" className="nav-link">Teach a skill</a>
          </div>

          <div className="header-actions">
            <div className="points-toolbar" aria-label="120 points">
              <span className="sparkle-icon" aria-hidden="true" />
              <span className="points-count">120 points</span>
            </div>

            <button
              className="notifications-button"
              type="button"
              aria-label="Notifications"
              title="Notifications"
            >
              <span className="bell-icon" aria-hidden="true" />
            </button>

            <button
              className="profile-button"
              type="button"
              aria-label="Profile"
              title="Profile"
            >
              <span className="profile-initials">SM</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="guidelines-content">
        <section className="guidelines-intro">
          <p className="trust-label">A COMMUNITY BUILT ON TRUST</p>
          <h1 className="guidelines-title">Community Guidelines</h1>
          <p className="guidelines-description">
            A few shared rules help make learning and teaching welcoming for
            everyone.
          </p>
        </section>

        <section className="guidelines-grid" aria-label="Community rules">
          {guidelines.map((guideline, index) => (
            <article className="guideline-card" key={guideline}>
              <span className="rule-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="rule-text">{guideline}</p>
            </article>
          ))}
        </section>

        <div className="guidelines-actions">
          <Link to="/signup" className="guidelines-action">
            Back to Sign Up
          </Link>

          <a
            href="mailto:"
            className="guidelines-action"
            onClick={(event) => {
              event.preventDefault();
              alert("Please connect this action to your team's reporting contact.");
            }}
          >
            Report a concern
          </a>
        </div>
      </main>
    </div>
  );
}
