import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/settings.css";
import NavBar from "../components/NavBar";

export default function Settings() {
  const [visibility, setVisibility] = useState("Everyone");
  const [preferences, setPreferences] = useState({
    skillMatching: true,
    showReliability: true,
    showActivity: true,
  });
  const [message, setMessage] = useState("");

  const togglePreference = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
    setMessage("");
  };

  const savePreferences = (event) => {
    event.preventDefault();

    // This saves the settings in the current page state only.
    // Connect this handler to your backend when persistence is available.
    setMessage("Your preferences have been saved for this session.");
  };

  return (
    <div className="settings-page">
      <NavBar points={120} initials="SM" />

      <main className="settings-main">
        <div className="page-intro">
          <p className="eyebrow">YOUR ACCOUNT</p>
          <h1>Settings</h1>
          <p className="page-description">
            Choose what you share and how SkillTrade works for you.
          </p>
        </div>

        <div className="settings-layout">
          <form className="preferences-card" onSubmit={savePreferences}>
            <div className="card-heading">
              <div>
                <h2>Privacy &amp; preferences</h2>
                <p>Personalize your profile and discovery experience.</p>
              </div>
            </div>

            <div className="preference-list">
              <div className="preference-row">
                <div className="preference-copy">
                  <label htmlFor="profile-visibility">
                    Profile visibility
                  </label>
                  <p>Choose who can see your profile.</p>
                </div>

                <select
                  id="profile-visibility"
                  value={visibility}
                  onChange={(event) => {
                    setVisibility(event.target.value);
                    setMessage("");
                  }}
                >
                  <option>Everyone</option>
                  <option>Members only</option>
                  <option>Private</option>
                </select>
              </div>

              <div className="preference-row">
                <div className="preference-copy">
                  <label htmlFor="skill-matching">Skill matching</label>
                  <p>Allow SkillTrade to suggest relevant skill exchanges.</p>
                </div>

                <button
                  id="skill-matching"
                  type="button"
                  role="switch"
                  aria-checked={preferences.skillMatching}
                  className={`toggle-switch ${
                    preferences.skillMatching ? "is-on" : ""
                  }`}
                  onClick={() => togglePreference("skillMatching")}
                >
                  <span className="toggle-knob" />
                  <span className="toggle-text">
                    {preferences.skillMatching ? "On" : "Off"}
                  </span>
                </button>
              </div>

              <div className="preference-row">
                <div className="preference-copy">
                  <label htmlFor="show-reliability">Show reliability</label>
                  <p>Display your reliability information on your profile.</p>
                </div>

                <button
                  id="show-reliability"
                  type="button"
                  role="switch"
                  aria-checked={preferences.showReliability}
                  className={`toggle-switch ${
                    preferences.showReliability ? "is-on" : ""
                  }`}
                  onClick={() => togglePreference("showReliability")}
                >
                  <span className="toggle-knob" />
                  <span className="toggle-text">
                    {preferences.showReliability ? "On" : "Off"}
                  </span>
                </button>
              </div>

              <div className="preference-row">
                <div className="preference-copy">
                  <label htmlFor="show-activity">Show activity</label>
                  <p>Let others see your teaching and learning activity.</p>
                </div>

                <button
                  id="show-activity"
                  type="button"
                  role="switch"
                  aria-checked={preferences.showActivity}
                  className={`toggle-switch ${
                    preferences.showActivity ? "is-on" : ""
                  }`}
                  onClick={() => togglePreference("showActivity")}
                >
                  <span className="toggle-knob" />
                  <span className="toggle-text">
                    {preferences.showActivity ? "On" : "Off"}
                  </span>
                </button>
              </div>
            </div>

            <div className="save-area">
              <button className="primary-button" type="submit">
                Save preferences
              </button>

              {message && (
                <p className="settings-message" role="status">
                  {message}
                </p>
              )}
            </div>
          </form>

          <aside className="account-sidebar">
            <section className="account-card">
              <h2>Your account</h2>
              <p className="account-email">sara@example.com</p>
              <p className="account-note">
                Manage your account details and sign-in options.
              </p>
            </section>

            <section className="account-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() =>
                  setMessage("Password changes are not connected yet.")
                }
              >
                Change password
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={() =>
                  setMessage("Sign-out functionality is not connected yet.")
                }
              >
                Sign out
              </button>

              <Link className="back-profile-link" to="/profile">
                <span aria-hidden="true">←</span> Back to profile
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
