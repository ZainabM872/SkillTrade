import React from "react";
import "../styles/booking-faq.css"; // shared FAQ styles (same layout as the other FAQ pages)
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const STEPS = [
  {
    number: "01",
    title: "Check the meeting plan",
    text: "Check your session’s date, time, location, and meeting instructions. Mark that you’ve arrived when you reach the meeting point.",
  },
  {
    number: "02",
    title: "Find each other safely",
    text: "Use optional location sharing if you need help finding each other. Respect your learning partner’s privacy.",
  },
  {
    number: "03",
    title: "Report what happened",
    text: "If the session didn’t happen, report attendance accurately. Contact support for help with a no-show or safety concern.",
  },
];

export default function NoShowFAQ() {
  const navigate = useNavigate();

  return (
    <main className="faq-root">
      {/* shared navbar, same component as the booking page */}
      <div className="faq-nav-wrap">
        <NavBar points={150} initials="SM" />
      </div>

      <div className="faq-page">
        {/* heading */}
        <p className="faq-eyebrow">SKILLTRADE HELP</p>
        <h1 className="faq-title">What if someone doesn’t show up?</h1>
        <p className="faq-sub">Start with the agreed meeting plan.</p>

        <div className="faq-layout">
          {/* steps */}
          <ol className="faq-steps">
            {STEPS.map((step) => (
              <li key={step.number} className="faq-step">
                <span className="faq-step-badge" aria-hidden="true">
                  {step.number}
                </span>
                <div className="faq-step-body">
                  <h2 className="faq-step-title">{step.title}</h2>
                  <p className="faq-step-text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* side actions */}
          <aside className="faq-aside">
            <button
              type="button"
              className="faq-btn faq-btn--soft"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              type="button"
              className="faq-btn faq-btn--soft"
              onClick={() => navigate("/help")}
            >
              All help topics
            </button>

            <div className="faq-help-card">
              <h2 className="faq-help-title">Still need a hand?</h2>
              <p className="faq-help-text">
                We’re here to help you learn and teach with confidence.
              </p>
            </div>

            <button
              type="button"
              className="faq-btn faq-btn--primary"
              onClick={() => navigate("/contact-support")}
            >
              Contact support
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
