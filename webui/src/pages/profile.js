import React from "react";
import { Link } from "react-router-dom";
import "../styles/profile.css";
import NavBar from "../components/NavBar";

export default function Main() {
  return (
    <div className="profile-page">
      {/* Global page header */}
      <NavBar points={120} initials="SM" />

      {/* Main page content */}
      <main className="profile-content">
        <section className="welcome-section">
          <p className="section-label">YOUR SKILLTRADE</p>
          <h1 className="greeting">Hello, Sara Moon</h1>
          <p className="location-summary">
            Calgary · Your skills, people, and progress in one place.
          </p>
        </section>

        <div className="profile-layout">
          {/* Profile sidebar */}
          <aside className="profile-card">
            <div className="profile-identity">
              <div className="profile-initials" aria-hidden="true">
                SM
              </div>
              <h2 className="profile-name">Sara Moon</h2>
              <p className="profile-rating">
                <span aria-hidden="true">★</span> 4.9 rating · 96% reliable
              </p>
            </div>

            <div className="points-summary">
              <p className="skill-points">120</p>
              <p className="points-label">skill points</p>
            </div>

            <div className="profile-actions-list">
              <Link to="/skill-points-faq" className="secondary-button">
                How points work
              </Link>
              <Link to="/teaching-locations" className="secondary-button">
                Teaching locations
              </Link>
              <Link to="/settings" className="secondary-button">
                Settings
              </Link>
              <Link to="/help" className="secondary-button">
                Help &amp; FAQ
              </Link>
            </div>
          </aside>

          {/* Main profile dashboard */}
          <div className="profile-dashboard">
            <section className="skills-section">
              <div className="section-heading-row">
                <h2 className="content-heading">Skills I teach</h2>
                <Link to="/teach" className="primary-button">
                  + Teach a new skill
                </Link>
              </div>

              <article className="skill-listing">
                <div className="skill-illustration">
                  <div className="skill-artwork" aria-hidden="true">
                    <div className="ellipse" />
                    <div className="ellipse-1" />
                    <div className="skate-icon" />
                  </div>
                  <span className="category-label">
                    SPORTS &amp; MOVEMENT
                  </span>
                </div>

                <div className="skill-details">
                  <h3 className="skill-title">Skating basics</h3>
                  <p className="skill-level">
                    Intermediate <span>·</span> In person
                  </p>
                  <p className="skill-tags">
                    Balance · Confidence · Fundamentals
                  </p>
                  <p className="points-rate">15 points / hour</p>
                </div>
              </article>
            </section>

            <section className="learning-section">
              <h2 className="content-heading">Skills I want to learn</h2>
              <div className="learning-card">
                <div className="learning-tags">
                  <span className="learning-tag">🎸 Guitar</span>
                  <span className="learning-tag">🇰🇷 Korean</span>
                </div>
                <p className="learning-description">
                  Stay curious. Your next skill is waiting.
                </p>
                <Link to="/meeting-location" className="text-link">
                  Preview a guitar meeting location →
                </Link>
                <Link to="/explore" className="text-link">
                  Explore skills →
                </Link>
              </div>
            </section>

            <section className="activity-section">
              <h2 className="content-heading">Your activity</h2>
              <div className="activity-grid">
                <article className="activity-card">
                  <p className="activity-number">12</p>
                  <p className="activity-label">Sessions taught</p>
                </article>

                <article className="activity-card">
                  <p className="activity-number">8</p>
                  <p className="activity-label">Sessions learned</p>
                </article>

                <article className="activity-card">
                  <p className="activity-number">4.9</p>
                  <p className="activity-label">Average rating</p>
                </article>
              </div>

              <Link to="/sessions" className="text-link activity-link">
                View your sessions →
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
