import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/skill-points-faq.css";

// The saved help article's content stays separate from its search and layout.
const questions = [
  {
    question: "What are skill points?",
    paragraphs: [
      "Skill points connect teaching and learning in SkillTrade. Earn points by teaching, then use them to book a skill you want to learn.",
      "Check the point cost on the listing before sending a session request.",
    ],
  },
  {
    question: "How do I earn points?",
    paragraphs: [
      "Create a skill listing and teach a session. After meeting, complete the attendance and session-completion steps shown in the app.",
      "Your listing includes the point cost, session format, and availability.",
    ],
  },
  {
    question: "How many points does a session cost?",
    paragraphs: [
      "The listing shows the point cost for the selected session duration. Review that amount before you book.",
      "If you change the duration, check the updated cost rather than assuming every session costs the same.",
    ],
  },
  {
    question: "Where can I see my balance?",
    paragraphs: [
      "Open Profile and look for Skill Points. That shows your current balance.",
      "The session cost and your available balance are different: one is what a session requires, and the other is what you have available.",
    ],
    link: { to: "/profile", label: "View your profile" },
  },
  {
    question: "What happens after a session?",
    paragraphs: [
      "Confirm attendance, leave a rating, and complete the skill-point steps shown in the app.",
      "Your star rating describes the teaching experience. Reliability reflects attendance and no-shows separately.",
    ],
    link: { to: "/rate-session", label: "Preview rating a session" },
  },
  {
    question: "What if a session is cancelled or someone misses it?",
    paragraphs: [
      "Use the session’s cancellation or attendance flow to record what happened. Review any point-related conditions shown before confirming.",
      "If the point outcome is unclear, contact support through Help and include the session details. A refund amount or penalty is not specified in this preview.",
    ],
  },
];

export default function SkillPointsFaq() {
  const [search, setSearch] = useState("");
  const searchInput = useRef(null);
  const query = search.trim().toLowerCase();
  const matchingQuestions = questions.filter((item) => {
    const text = [item.question, ...item.paragraphs, item.link?.label || ""].join(" ").toLowerCase();
    return text.includes(query);
  });

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Skill points FAQ · SkillTrade";
    return () => { document.title = previousTitle; };
  }, []);

  function clearSearch() {
    setSearch("");
    searchInput.current.focus();
  }

  return (
    <div className="skill-points-faq-page">
      <header className="sp-header"><div className="sp-header-inner">
        <Link className="sp-back" to="/help" aria-label="Back to Help centre">‹</Link>
        <Link className="sp-brand" to="/" aria-label="SkillTrade home">skill<span>Trade</span></Link>
        <nav className="sp-navigation" aria-label="Account navigation"><Link to="/profile">Profile</Link><Link to="/help">Help</Link></nav>
      </div></header>
      <main className="sp-main">
        <div className="sp-heading"><p className="eyebrow">SHARE WHAT YOU KNOW. LEARN SOMETHING NEW.</p><h1>How do skill points work?</h1><p>Understand how teaching, booking, and session completion fit together.</p></div>
        <div className="faq-workspace">
          <section className="faq-main" aria-labelledby="questions-title">
            <label htmlFor="points-faq-search" className="search-label">Find an answer</label>
            <div className="faq-search">
              <input ref={searchInput} id="points-faq-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search points, booking, balance…" autoComplete="off" aria-controls="points-faq-list" />
              {search.length > 0 && <button type="button" className="clear-search" onClick={clearSearch}>Clear</button>}
            </div>
            <div className="faq-toolbar"><h2 id="questions-title">Common questions</h2><span role="status">{query ? `${matchingQuestions.length} matching answer${matchingQuestions.length === 1 ? "" : "s"}` : `${questions.length} answers`}</span></div>
            <div id="points-faq-list">
              {matchingQuestions.map((item) => (
                // A new search opens matches; clearing returns to the first answer open.
                <details key={`${item.question}-${query}`} open={Boolean(query) || item === questions[0]}>
                  <summary>{item.question}</summary>
                  <div className="answer">{item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{item.link && <Link to={item.link.to}>{item.link.label}</Link>}</div>
                </details>
              ))}
            </div>
            {matchingQuestions.length === 0 && <div className="empty-results"><h3>No matching answers</h3><p>Try “balance”, “duration”, or “attendance”.</p><button className="secondary" type="button" onClick={clearSearch}>Show all answers</button></div>}
            <section className="help-footer"><h2>Still unsure?</h2><p>For a specific booking or point balance, use Contact support in the app’s Help centre.</p><Link className="secondary support-link" to="/contact-support">Contact support</Link></section>
          </section>
          <aside className="points-sidebar" aria-label="Understanding skill points">
            <section className="points-card"><span className="eyebrow">THE POINTS CYCLE</span><h2>A skill shared.<br />A new possibility.</h2><ol className="cycle">
              <li><span aria-hidden="true">01</span><div><b>Teach what you know</b><p>Share a skill through a session.</p></div></li>
              <li><span aria-hidden="true">02</span><div><b>Earn skill points</b><p>Complete the session flow.</p></div></li>
              <li><span aria-hidden="true">03</span><div><b>Learn something new</b><p>Use points toward another skill.</p></div></li>
            </ol></section>
            <section className="example-card"><span className="eyebrow">READING A SESSION COST</span><h2>Acoustic Guitar</h2><p>Example listing · Not your balance</p><div className="example-cost"><strong>15 <span>points</span></strong><span>60-minute session</span></div><p className="example-note">This is one example. Always use the cost shown on the actual listing for the duration you select.</p></section>
            <section className="quick-guide"><h2>Before you book</h2><ul><li>Check the point cost.</li><li>Review the duration and format.</li><li>Choose a location you can attend.</li></ul><Link className="secondary quick-link" to="/meeting-location">Preview choosing a location</Link></section>
          </aside>
        </div>
      </main>
    </div>
  );
}
