import React from "react";
import "../styles/user-listing.css";
import "../App.css"; // shared banner styles (same as the other pages)
import { NavLink, useNavigate } from "react-router-dom";

// The listing being managed. Later, load this by id (e.g. from the URL or an API).
const LISTING = {
  id: "skating-basics",
  title: "Skating basics",
  teacher: "Sara Moon",
  place: "Calgary",
  category: "Sports & movement",
  about: "Beginner skating fundamentals, balance, and confidence on the ice.",
  locations: [
    "Community centre lobby · Reception desk",
    "Public library · Second floor, by the elevators",
  ],
  points: 15,
  minutes: 60,
  format: "In person",
  level: "Intermediate",
};

export default function MyListing() {
  const navigate = useNavigate();

  return (
    <main>
      {/* top banner: identical to the other pages */}
      <div className="banner">
        <span className="logo-text">
          <span className="skill-text">skill</span>
          <span className="trade-text">Trade</span>
        </span>
        <nav className="nav">
          <NavLink className="nav-link" to="/homepage">
            Home
          </NavLink>
          <NavLink className="nav-link" to="/explore">
            Explore
          </NavLink>
          <NavLink className="nav-link" to="/sessions">
            Sessions
          </NavLink>
          <NavLink className="nav-link" to="/teach">
            Teach a skill
          </NavLink>
        </nav>
        <div className="banner-right">
          <div className="points-box">
            <span className="skillpoints">
              <span className="points-icon" />
              <span className="skillpoints-text">150 points</span>
            </span>
          </div>

          <button
            type="button"
            className="notifs-box"
            aria-label="Notifications"
            onClick={() => navigate("/notifications")}
          >
            <span className="notifs-icon" />
          </button>

          <button
            type="button"
            className="profile-box"
            aria-label="Your profile"
            onClick={() => navigate("/profile")}
          >
            <span className="userprofile">SM</span>
          </button>
        </div>
      </div>

      <div className="mylisting-page">
        {/* heading */}
        <p className="mylisting-eyebrow">YOUR LISTING</p>
        <h1 className="mylisting-title">{LISTING.title}</h1>
        <p className="mylisting-sub">
          A skill you teach · {LISTING.teacher} · {LISTING.place}
        </p>

        <div className="mylisting-layout">
          {/* ---------- left column ---------- */}
          <div className="mylisting-main">
            <div className="mylisting-hero" aria-hidden="true">
              <span className="mylisting-hero-label">
                {LISTING.category.toUpperCase()}
              </span>
            </div>

            <section className="mylisting-card">
              <h2 className="mylisting-card-title">About this skill</h2>
              <p className="mylisting-card-text">{LISTING.about}</p>
            </section>

            <section className="mylisting-card">
              <h2 className="mylisting-card-title">Meeting details</h2>
              <ul className="mylisting-locations">
                {LISTING.locations.map((place) => (
                  <li key={place}>{place}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* ---------- manage card ---------- */}
          <aside className="mylisting-manage">
            <h2 className="mylisting-manage-title">Manage your skill</h2>
            <p className="mylisting-manage-details">
              <span>
                {LISTING.points} points / hour · {LISTING.minutes} minutes
              </span>
              <span>
                {LISTING.format} · {LISTING.level}
              </span>
            </p>

            <button
              type="button"
              className="mylisting-btn mylisting-btn--primary"
              onClick={() => navigate(`/listings/${LISTING.id}/edit`)}
            >
              Edit listing
            </button>
            <button
              type="button"
              className="mylisting-btn mylisting-btn--soft"
              onClick={() => navigate(`/listings/${LISTING.id}/availability`)}
            >
              Manage availability
            </button>
            <button
              type="button"
              className="mylisting-back"
              onClick={() => navigate("/profile")}
            >
              ← Back to profile
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
