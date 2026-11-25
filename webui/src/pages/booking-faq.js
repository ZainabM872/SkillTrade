import React from "react";
import "../styles/booking-faq.css";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const STEPS = [
  {
    number: "01",
    title: "Find your next skill",
    items: [
      "Explore skills or search for something you’d like to learn.",
      "Open a skill to review the teacher, description, and points.",
    ],
  },
  {
    number: "02",
    title: "Choose the details",
    items: [
      "Choose an available date and time.",
      "Select a meeting location and review the cost.",
    ],
  },
  {
    number: "03",
    title: "Send your request",
    items: [
      "Send your request.",
      "Check Sessions for your teacher’s confirmation and meeting instructions.",
    ],
  },
];

export default function BookingFAQ() {
  const navigate = useNavigate();

  // numbering of the instructions continues across steps (1-2, 3-4, 5-6)
  let count = 0;

  return (
    <main className="faq-root">
      {/* shared navbar, same component as the booking page */}
      <div className="faq-nav-wrap">
        <NavBar points={150} initials="SM" />
      </div>

      <div className="faq-page">
        {/* heading */}
        <p className="faq-eyebrow">SKILLTRADE HELP</p>
        <h1 className="faq-title">How do I book a session?</h1>
        <p className="faq-sub">From curiosity to your next class.</p>

        <div className="faq-layout">
          {/* steps */}
          <ol className="faq-steps">
            {STEPS.map((step) => {
              const start = count + 1;
              count += step.items.length;
              return (
                <li key={step.number} className="faq-step">
                  <span className="faq-step-badge" aria-hidden="true">
                    {step.number}
                  </span>
                  <div className="faq-step-body">
                    <h2 className="faq-step-title">{step.title}</h2>
                    <ol className="faq-step-list" start={start}>
                      {step.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </li>
              );
            })}
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
