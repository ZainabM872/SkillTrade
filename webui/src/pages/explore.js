import React, { useState } from "react";
import "../styles/explore.css";
import "../App.css"; // shared banner styles (same as the home page)
import { NavLink, useNavigate } from "react-router-dom";

const CATEGORIES = ["All", "Music", "Languages", "Tech", "Art"];

const SKILLS = [
  {
    id: "guitar-for-beginners",
    title: "Guitar for beginners",
    teacher: "Alex Morgan",
    place: "Calgary",
    mode: "in-person",
    category: "Music",
    thumb: "guitar",
  },
  {
    id: "conversational-korean",
    title: "Conversational Korean",
    teacher: "Taylor Reed",
    place: "Online",
    mode: "online",
    category: "Languages",
    thumb: "korean",
  },
  {
    id: "python-fundamentals",
    title: "Python fundamentals",
    teacher: "Jordan Blake",
    place: "Online",
    mode: "online",
    category: "Tech",
    thumb: "tech",
    label: "TECHNOLOGY",
  },
  {
    id: "photography-basics",
    title: "Photography basics",
    teacher: "Emma Chen",
    place: "Calgary",
    mode: "in-person",
    category: "Art",
    thumb: "photo",
    label: "PHOTOGRAPHY",
  },
];

const MODES = [
  { value: "all", label: "All" },
  { value: "in-person", label: "In person" },
  { value: "online", label: "Online" },
];

export default function Explore() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const q = query.trim().toLowerCase();
  const visible = SKILLS.filter(
    (s) =>
      (category === "All" || s.category === category) &&
      (mode === "all" || s.mode === mode) &&
      (!q || `${s.title} ${s.teacher} ${s.category}`.toLowerCase().includes(q)),
  );

  return (
    <main>
      {/* top banner: identical to the home page */}
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

      <div className="explore-page">
        {/* heading */}
        <p className="explore-eyebrow">FIND YOUR NEXT “I CAN”</p>
        <h1 className="explore-title">Explore skills</h1>
        <p className="explore-sub">
          A little curiosity goes a long way. Find people who can help you grow.
        </p>

        {/* search + filters */}
        <form
          className="explore-search-row"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="explore-search">
            <span className="explore-search-icon" aria-hidden="true" />
            <input
              type="search"
              className="explore-search-input"
              placeholder="Search skills or teachers…"
              aria-label="Search skills or teachers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <button
            type="button"
            className={`explore-filters-btn${showFilters ? " is-open" : ""}`}
            aria-expanded={showFilters}
            onClick={() => setShowFilters((open) => !open)}
          >
            <span className="explore-filter-icon" aria-hidden="true" />
            Filters
          </button>
        </form>

        {showFilters && (
          <div
            className="explore-filter-panel"
            role="group"
            aria-label="Filter by format"
          >
            <span className="explore-filter-label">Format</span>
            {MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                className={`explore-chip${mode === m.value ? " is-selected" : ""}`}
                aria-pressed={mode === m.value}
                onClick={() => setMode(m.value)}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        {/* category pills */}
        <div className="explore-pills" role="group" aria-label="Categories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`explore-pill${category === c ? " is-selected" : ""}`}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* results */}
        <div className="explore-results-header">
          <h2 className="explore-results-title">Skills for you</h2>
          <span className="explore-results-count">
            {visible.length} {visible.length === 1 ? "skill" : "skills"} ·
            Calgary + online
          </span>
        </div>

        {visible.length > 0 ? (
          <div className="explore-grid">
            {visible.map((s) => (
              <button
                key={s.id}
                type="button"
                className="explore-card"
                onClick={() => navigate(`/skills/${s.id}`)}
              >
                <span
                  className={`explore-card-thumb explore-card-thumb--${s.thumb}`}
                >
                  {s.label}
                </span>
                <span className="explore-card-title">{s.title}</span>
                <span className="explore-card-meta">
                  {s.teacher} · {s.place}
                </span>
                <span className="explore-card-rating">
                  ★ 4.9 · Beginner friendly
                </span>
                <span className="explore-card-price">15 points / hour</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="explore-empty">
            No skills match your search. Try a different word or clear the
            filters.
          </p>
        )}

        {/* teach CTA */}
        <section className="explore-cta" aria-labelledby="explore-cta-title">
          <div className="explore-cta-text">
            <h2 id="explore-cta-title" className="explore-cta-title">
              Something to share?
            </h2>
            <p className="explore-cta-sub">
              Your everyday skills could be someone else’s next discovery.
            </p>
          </div>
          <button
            type="button"
            className="explore-cta-btn"
            onClick={() => navigate("/teach")}
          >
            Teach a skill
          </button>
        </section>
      </div>
    </main>
  );
}
