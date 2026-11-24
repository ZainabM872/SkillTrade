import React from "react";
import { Link } from "react-router-dom";
import "../styles/help.css";
import NavBar from "../components/NavBar";

const faqItems = [
  {
    category: "BOOKING",
    question: "How do I book a session?",
    description: "Find a skill and reserve your next session.",
    to: "/booking-faq",
  },
  {
    category: "SKILL POINTS",
    question: "How do skill points work?",
    description: "Earn, spend, and understand your balance.",
    to: "/skill-points-faq",
  },
  {
    category: "ATTENDANCE",
    question: "What if someone doesn’t show up?",
    description: "What to do when a session doesn’t happen.",
    to: "/noshow-faq",
  },
  {
    category: "CHANGE OF PLANS",
    question: "Can I cancel or reschedule?",
    description: "Review your upcoming sessions and coordinate a new time.",
    to: "/cancellation-faq",
  },
  {
    category: "TRUST & RELIABILITY",
    question: "How does reliability work?",
    description: "Learn about attendance and community expectations.",
    to: "/reliability-faq",
  },
  {
    category: "TEACHING",
    question: "How do I teach a skill?",
    description: "Share your skills with the community.",
    to: "/teaching-faq",
  },
];

export default function Help() {
  return (
    <div className="help-page">
      <NavBar points={120} initials="SM" />

      <main className="help-main">
        <section className="help-intro">
          <p className="help-eyebrow">A LITTLE HELP GOES A LONG WAY</p>
          <h1>How can we help?</h1>
          <p className="help-description">
            Find clear answers about learning, teaching, points, and your
            community.
          </p>
        </section>

        <section
          className="help-faq-grid"
          aria-label="Frequently asked questions"
        >
          {faqItems.map((item) => (
            <Link className="help-faq-card" to={item.to} key={item.question}>
              <span className="help-faq-category">{item.category}</span>
              <h2>{item.question}</h2>
              <p>{item.description}</p>
              <span className="help-card-footer">
                Explore this topic <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </section>

        <section className="help-support">
          <div>
            <h2>Still need a hand?</h2>
            <p>
              If you couldn’t find your answer, get in touch with the SkillTrade
              team.
            </p>
          </div>
          <Link to="/contact-support" className="help-support-button">
            Contact support <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
