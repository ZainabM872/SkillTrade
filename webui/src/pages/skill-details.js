import React from "react";
import "../styles/skill-details.css";
import "../App.css"; // shared banner styles (same as the other pages)
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { SKILLS } from "./skills";

export default function SkillDetail() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { skillId } = useParams(); // the ":skillId" part of /skills/:skillId

  const skill = SKILLS[skillId];
  const inPerson = skill?.format === "In person";

  // Explore stays purple on skill pages (as in your design)
  const exploreClass = ({ isActive }) =>
    `nav-link${isActive || pathname.startsWith("/skills") ? " active" : ""}`;

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
          <NavLink className={exploreClass} to="/explore">
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

      <div className="skill-page">
        <button
          type="button"
          className="skill-back"
          onClick={() => navigate(-1)}
        >
          ← Back to results
        </button>

        {!skill ? (
          <div className="skill-missing">
            <h1 className="skill-missing-title">We couldn’t find that skill</h1>
            <p className="skill-missing-text">
              It may have been removed, or the link may be wrong.
            </p>
            <Link className="skill-btn skill-btn--primary" to="/explore">
              Explore skills
            </Link>
          </div>
        ) : (
          <div className="skill-layout">
            {/* ---------- left column ---------- */}
            <div className="skill-main">
              <div className="skill-hero" aria-hidden="true">
                <span className="skill-hero-label">
                  {`${skill.category} · ${skill.level}`.toUpperCase()}
                </span>
              </div>

              <p className="skill-eyebrow">
                {`${skill.category} · ${skill.level}`.toUpperCase()}
              </p>
              <h1 className="skill-title">{skill.title}</h1>
              <p className="skill-lead">{skill.description}</p>

              <section className="skill-card">
                <h2 className="skill-card-title">{skill.teacher}</h2>
                <p className="skill-card-text">
                  ★ {skill.rating} from {skill.reviews} real sessions ·{" "}
                  {skill.taught} sessions taught
                </p>
              </section>

              <section className="skill-card">
                <h2 className="skill-card-title">What to bring</h2>
                <p className="skill-card-text">{skill.bring}</p>
              </section>
            </div>

            {/* ---------- booking card ---------- */}
            <aside className="skill-booking">
              <h2 className="skill-booking-title">Your next new skill</h2>
              <p className="skill-price">{skill.points} points / hour</p>
              <p className="skill-booking-sub">
                {skill.minutes}-minute session · {skill.format}
              </p>

              <h3 className="skill-meet-title">
                {inPerson ? "Meet in person" : "Meet online"}
              </h3>
              {inPerson ? (
                <ul className="skill-locations">
                  {skill.locations.map((place) => (
                    <li key={place.name}>
                      <span className="skill-location-name">{place.name}</span>
                      <span className="skill-location-note">{place.note}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="skill-booking-sub">
                  Your teacher will send a video link once your session is
                  confirmed.
                </p>
              )}

              <button
                type="button"
                className="skill-btn skill-btn--primary"
                onClick={() => navigate(`/skills/${skill.id}/book`)}
              >
                Book a session
              </button>
              <Link
                className="skill-points-link"
                to="/how-points-work"
                target="_blank"
                rel="noopener noreferrer"
              >
                How do points work? ↗
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
