import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/skill-points-faq.css";

// The saved help article's content stays separate from its search and layout.
const questions = [
  {
    "question": "What does reliability measure?",
    "paragraphs": [
      "Reliability reflects attendance and no-shows. It helps you understand whether someone follows through on their sessions.",
      "A lower score means more missed sessions. It is separate from the star rating for the teaching experience."
    ]
  },
  {
    "question": "How is reliability different from a session rating?",
    "paragraphs": [
      "The session rating describes your learning experience, such as the explanation, pace, and quality of the teaching.",
      "Reliability reflects attendance. Use the attendance flow to record a missed session rather than using a low star rating as a substitute."
    ],
    "link": {
      "to": "/rate-session",
      "label": "Preview rating a session"
    }
  },
  {
    "question": "Where can I check someone’s reliability?",
    "paragraphs": [
      "Look for reliability alongside the teacher’s rating in the skill or session details.",
      "Consider both: a high skill rating tells you about the experience, while reliability tells you about attendance."
    ]
  },
  {
    "question": "What should I do if someone doesn’t show?",
    "paragraphs": [
      "Check the session time, selected meeting location, and instructions. Use the arrival or location features if you are having trouble finding each other.",
      "If the session did not take place, use the session’s attendance or no-show option to report what happened accurately."
    ],
    "link": {
      "to": "/location-shared",
      "label": "Continue to finding each other"
    }
  },
  {
    "question": "What if I need to reschedule or cancel?",
    "paragraphs": [
      "Open the booking in Sessions and choose Reschedule or Cancel session. Review the conditions shown before confirming.",
      "Make changes as early as possible. This preview does not specify an automatic reliability penalty for cancellations or rescheduling."
    ]
  },
  {
    "question": "How can I be a dependable participant?",
    "paragraphs": [
      "Choose sessions you can attend, check the meeting instructions beforehand, and arrive on time.",
      "If plans change, update the booking early. After meeting, complete the attendance steps accurately."
    ],
    "link": {
      "to": "/meeting-location",
      "label": "Preview choosing a meeting spot"
    }
  },
  {
    "question": "What if the attendance record seems wrong?",
    "paragraphs": [
      "Open Help and choose Contact support. Include the session details and explain what happened.",
      "This preview does not calculate reliability or automatically change attendance records. It cannot guarantee a score adjustment."
    ]
  }
];

export default function ReliabilityFaq() {
  const [search, setSearch] = useState("");
  const searchInput = useRef(null);
  const query = search.trim().toLowerCase();
  const matchingQuestions = questions.filter((item) => {
    const text = [item.question, ...item.paragraphs, item.link?.label || ""].join(" ").toLowerCase();
    return text.includes(query);
  });

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Reliability FAQ · SkillTrade";
    return () => { document.title = previousTitle; };
  }, []);

  function clearSearch() {
    setSearch("");
    searchInput.current.focus();
  }

  return (
    <div className="skill-points-faq-page reliability-faq-page">
      <header className="sp-header"><div className="sp-header-inner">
        <Link className="sp-back" to="/help" aria-label="Back to Help centre">‹</Link>
        <Link className="sp-brand" to="/" aria-label="SkillTrade home">skill<span>Trade</span></Link>
        <nav className="sp-navigation" aria-label="Account navigation"><Link to="/profile">Profile</Link><Link to="/help">Help</Link></nav>
      </div></header>
      <main className="sp-main">
        <div className="sp-heading"><p className="eyebrow">SHOW UP. BUILD TRUST. KEEP LEARNING.</p><h1>How does reliability work?</h1><p>Understand attendance, no-shows, and how reliability differs from a session rating.</p></div>
        <div className="faq-workspace">
          <section className="faq-main" aria-labelledby="questions-title">
            <label htmlFor="reliability-faq-search" className="search-label">Find an answer</label>
            <div className="faq-search">
              <input ref={searchInput} id="reliability-faq-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search attendance, rating, no-shows…" autoComplete="off" aria-controls="reliability-faq-list" />
              {search.length > 0 && <button type="button" className="clear-search" onClick={clearSearch}>Clear</button>}
            </div>
            <div className="faq-toolbar"><h2 id="questions-title">Common questions</h2><span role="status">{query ? `${matchingQuestions.length} matching answer${matchingQuestions.length === 1 ? "" : "s"}` : `${questions.length} answers`}</span></div>
            <div id="reliability-faq-list">
              {matchingQuestions.map((item) => (
                // A new search opens matches; clearing returns to the first answer open.
                <details key={`${item.question}-${query}`} open={Boolean(query) || item === questions[0]}>
                  <summary>{item.question}</summary>
                  <div className="answer">{item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{item.link && <Link to={item.link.to}>{item.link.label}</Link>}</div>
                </details>
              ))}
            </div>
            {matchingQuestions.length === 0 && <div className="empty-results"><h3>No matching answers</h3><p>Try “attendance”, “rating”, or “cancel”.</p><button className="secondary" type="button" onClick={clearSearch}>Show all answers</button></div>}
            <section className="help-footer"><h2>Still unsure?</h2><p>For a specific attendance record, use Contact support in the app’s Help centre.</p><Link className="secondary support-link" to="/contact-support">Contact support</Link><Link className="secondary support-link related-link" to="/skill-points-faq">How skill points work</Link></section>
          </section>
          <aside className="points-sidebar" aria-label="Understanding reliability"><section className="points-card"><span className="eyebrow">TWO DIFFERENT SIGNALS</span><h2>Good teaching.<br />Showing up.</h2><ol className="cycle"><li><span>★</span><div><b>Session rating</b><p>How was the teaching and learning experience?</p></div></li><li><span>✓</span><div><b>Reliability</b><p>Did the participant attend their sessions?</p></div></li></ol></section><section className="example-card"><span className="eyebrow">UNDERSTANDING THE SCORE</span><h2>Reliability score</h2><p>Example only · Not your account score</p><div className="example-cost"><strong>4.5 <span>/ 5</span></strong><span>Illustrative score</span></div><p className="example-note">A lower score means more missed sessions. The exact calculation and update timing are not specified in this preview.</p></section><section className="quick-guide"><h2>A dependable meetup</h2><ul><li>Check the time and meeting spot.</li><li>Update a booking if plans change.</li><li>Record attendance accurately.</li></ul><Link to="/arrived" className="secondary quick-link">Preview confirming a meetup</Link></section></aside>
        </div>
      </main>
    </div>
  );
}
