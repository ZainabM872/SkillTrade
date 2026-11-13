import React from "react";
import "../styles/homepage.css";

export default function Main() {
  return (
    /* main background */
    <main-container>
      {/* top banner with logo, points, and navigation links */}
      <div className="banner">
        <span className="logo-text">
          <span className="skill-text">skill</span>
          <span className="trade-text">Trade</span>
        </span>
        <span className="home">Home</span>
        <span className="explore">Explore</span>
        <span className="sessions">Sessions</span>
        <span className="teach">Teach a skill</span>
        <span className="skillpoints">
          <span className="pointicon" />
          <span className="pointtext">120 points</span>
        </span>
        <span className="notifbutton">
          <span className="notificon"></span>
        </span>
        <span className="userprofile">
          <span>SM</span>
        </span>
      </div>

      {/* main content area with welcome message, search bar, and featured skills */}
      <div className="section-2" />
      <div className="group-4" />
      <span className="text-7">YOUR COMMUNITY. YOUR CURIOSITY.</span>
      <span className="text-8">What will you learn next, Sara?</span>
      <span className="text-9">
        Find your next skill, share your own, and make room for something new.
      </span>
      <span className="text-a" />
      <div className="group-5">
        <div className="wrapper">
          <span className="text-b">Search skills, teachers, or interests…</span>
          <div className="pic-2" />
        </div>
        <div className="wrapper-2">
          <div className="img-2" />
          <span className="text-c">Filters</span>
        </div>
      </div>
      <div className="box-2">
        <div className="section-3">
          <span className="text-d">TEACH. EARN. LEARN.</span>
          <span className="text-e">Turn your skills into new ones.</span>
          <span className="text-f">
            Earn 15 points for every hour you teach.
          </span>
        </div>
        <div className="box-3">
          <span className="text-10">How points work</span>
        </div>
      </div>
      <div className="box-4">
        <span className="text-11">Featured skills</span>
        <span className="text-12">Explore all →</span>
      </div>
      <div className="section-4">
        <div className="group-6">
          <div className="pic-3" />
          <span className="text-13">Acoustic guitar</span>
          <span className="text-14">Alex Morgan · In person in Calgary</span>
          <span className="text-15">★ 4.9 · Beginner friendly</span>
          <span className="text-16">15 points / hour</span>
        </div>
        <div className="group-7">
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
      <div className="box-5">
        <span className="text-1f">Teach a new skill</span>
      </div>
    </main-container>
  );
}
