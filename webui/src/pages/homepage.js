import React, { useState } from "react";
import "../styles/homepage.css";
import "../App.css";
import { NavLink, useNavigate } from "react-router-dom";
import Filters from "./filters";

export default function Main() {
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);

  // "Show matching skills": close the popup and open Explore with the chosen filters
  const handleApplyFilters = (filters) => {
    setShowFilters(false);
    navigate("/explore", { state: { filters } });
  };

  return (
    <main>
      {/* top banner with logo, points, and navigation links */}
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

          {/* clickable: notifications */}
          <button
            type="button"
            className="notifs-box"
            aria-label="Notifications"
            onClick={() => navigate("/notifications")}
          >
            <span className="notifs-icon" />
          </button>

          {/* clickable: profile */}
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

      {/* main content area with welcome message, search bar, and featured skills */}
      <div className="page">
        <span className="text-7">YOUR COMMUNITY. YOUR CURIOSITY.</span>
        <span className="text-8">What will you learn next, Sara?</span>
        <span className="text-9">
          Find your next skill, share your own, and make room for something new.
        </span>

        <div className="search-row">
          <span className="wrapper">
            <span className="search-icon" />
            <span className="search-input-wrap">
              <input
                type="text"
                placeholder="Search skills, teachers, or interests…"
                aria-label="Search skills, teachers, or interests"
              />
            </span>
          </span>
          <button
            type="button"
            className="wrapper-2"
            aria-haspopup="dialog"
            onClick={() => setShowFilters(true)}
          >
            <span className="filter-icon" />
            <span className="text-c">Filters</span>
          </button>
        </div>

        {/* promo banner */}
        <div className="box-2">
          <div className="section-3">
            <span className="promo-text">TEACH. EARN. LEARN.</span>
            <span className="promo-text">Turn your skills into new ones.</span>
            <span className="promo-text">
              Earn 15 points for every hour you teach.
            </span>
          </div>

          {/* clickable: how points work */}
          <button
            type="button"
            className="box-3"
            onClick={() => navigate("/skill-points-faq")}
          >
            <span className="promo-text">How points work</span>
          </button>
        </div>

        <div className="section-header">
          <span className="section-title">Featured skills</span>
          <span className="section-link">Explore all →</span>
        </div>

        {/* clickable: each skill card */}
        <div className="section-4">
          <button
            type="button"
            className="section-5"
            onClick={() => navigate("/skills/acoustic-guitar")}
          >
            <span className="pic-3" />
            <span className="text-13">Acoustic guitar</span>
            <span className="text-14">Alex Morgan · In person in Calgary</span>
            <span className="text-15">★ 4.9 · Beginner friendly</span>
            <span className="text-16">15 points / hour</span>
          </button>

          <button
            type="button"
            className="section-5"
            onClick={() => navigate("/skills/conversational-korean")}
          >
            <span className="img-3" />
            <span className="text-17">Conversational Korean</span>
            <span className="text-18">Taylor Reed · Online</span>
            <span className="text-19">★ 4.9 · Beginner friendly</span>
            <span className="text-1a">15 points / hour</span>
          </button>

          <button
            type="button"
            className="section-5"
            onClick={() => navigate("/skills/excel-basics")}
          >
            <span className="pic-4" />
            <span className="text-1b">Excel basics</span>
            <span className="text-1c">Jordan Blake · Online</span>
            <span className="text-1d">★ 4.9 · Beginner friendly</span>
            <span className="text-1e">15 points / hour</span>
          </button>
        </div>

        {/* clickable: teach a new skill */}
        <button
          type="button"
          className="teach-button"
          onClick={() => navigate("/teach")}
        >
          <span className="promo-text">Teach a new skill</span>
        </button>
      </div>

      {/* Filters popup */}
      {showFilters && (
        <Filters
          onClose={() => setShowFilters(false)}
          onApply={handleApplyFilters}
        />
      )}
    </main>
  );
}
