import React from "react";
import "../styles/user-listing.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

// Placeholder listings, keyed by id, until the backend is ready.
// Later: replace this lookup with a fetch using the id from the URL.
const LISTINGS = {
  "skating-basics": {
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
  },
};

export default function MyListing() {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const listing = LISTINGS[listingId];

  return (
    <main className="mylisting-root">
      {/* shared navbar, same component as the booking page */}
      <div className="mylisting-nav-wrap">
        <NavBar points={150} initials="SM" />
      </div>

      <div className="mylisting-page">
        {!listing ? (
          <p role="alert">
            This listing is no longer available.{" "}
            <Link to="/profile">Back to profile</Link>
          </p>
        ) : (
          <>
            {/* heading */}
            <p className="mylisting-eyebrow">YOUR LISTING</p>
            <h1 className="mylisting-title">{listing.title}</h1>
            <p className="mylisting-sub">
              A skill you teach · {listing.teacher} · {listing.place}
            </p>

            <div className="mylisting-layout">
              {/* ---------- left column ---------- */}
              <div className="mylisting-main">
                <div className="mylisting-hero" aria-hidden="true">
                  <span className="mylisting-hero-label">
                    {listing.category.toUpperCase()}
                  </span>
                </div>

                <section className="mylisting-card">
                  <h2 className="mylisting-card-title">About this skill</h2>
                  <p className="mylisting-card-text">{listing.about}</p>
                </section>

                <section className="mylisting-card">
                  <h2 className="mylisting-card-title">Meeting details</h2>
                  <ul className="mylisting-locations">
                    {listing.locations.map((place) => (
                      <li key={place}>{place}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <aside className="mylisting-manage">
                <h2 className="mylisting-manage-title">Manage your skill</h2>
                <p className="mylisting-manage-details">
                  <span>
                    {listing.points} points / hour · {listing.minutes} minutes
                  </span>
                  <span>
                    {listing.format} · {listing.level}
                  </span>
                </p>

                <button
                  type="button"
                  className="mylisting-btn mylisting-btn--primary"
                  onClick={() => navigate(`/listings/${listing.id}/edit`)}
                >
                  Edit listing
                </button>
                <button
                  type="button"
                  className="mylisting-btn mylisting-btn--soft"
                  onClick={() =>
                    navigate(`/listings/${listing.id}/availability`)
                  }
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
          </>
        )}
      </div>
    </main>
  );
}
