import React from "react";
import "../styles/homepage.css";
import "../App.css";
import { Link } from "react-router-dom";

export default function Main() {
  return (
    <main>
      {/* top banner with logo, points, and navigation links */}
      <div className="banner">
        <span className="logo-text">
          <span className="skill-text">skill</span>
          <span className="trade-text">Trade</span>
        </span>
        <nav className="nav">
          <Link className="home" to="/homepage">
            Home
          </Link>
          <span className="explore">Explore</span>
          <span className="sessions">Sessions</span>
          <span className="teach">Teach a skill</span>
        </nav>
        <div className="banner-right">
          <div className="points-box">
            <span className="skillpoints">
              <span className="points-icon" />
              <span className="skillpoints-text">150 points</span>
            </span>
          </div>
          <div className="notifs-box">
            <span className="notifs-icon"></span>
          </div>
          <div className="profile-box">
            <span className="userprofile">SM</span>
          </div>
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
            <span>
              <input
                type="text"
                placeholder="Search skills, teachers, or interests…"
              />
            </span>
          </span>
          <span className="wrapper-2">
            <span className="filter-icon" />
            <span className="text-c">Filters</span>
          </span>
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
          <div className="box-3">
            <span className="promo-text">How points work</span>
          </div>
        </div>

        <div className="section-header">
          <span>Featured Skills</span>
          <span>Explore all →</span>
        </div>

        <div className="section-4">
          <div className="section-5">
            <div className="pic-3" />
            <span className="text-13">Acoustic guitar</span>
            <span className="text-14">Alex Morgan · In person in Calgary</span>
            <span className="text-15">★ 4.9 · Beginner friendly</span>
            <span className="text-16">15 points / hour</span>
          </div>

          <div className="section-5">
            <div className="img-3" />
            <span className="text-17">Conversational Korean</span>
            <span className="text-18">Taylor Reed · Online</span>
            <span className="text-19">★ 4.9 · Beginner friendly</span>
            <span className="text-1a">15 points / hour</span>
          </div>

          <div className="section-5">
            <div className="pic-4" />
            <span className="text-1b">Excel basics</span>
            <span className="text-1c">Jordan Blake · Online</span>
            <span className="text-1d">★ 4.9 · Beginner friendly</span>
            <span className="text-1e">15 points / hour</span>
          </div>
        </div>
        <div className="teach-button">
          <span className="promo-text">Teach a new skill</span>
        </div>
      </div>
    </main>
  );
}
