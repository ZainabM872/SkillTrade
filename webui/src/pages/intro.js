import React, { useEffect, useRef, useState } from "react";
import "../styles/intro.css";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  function submit(event) {
    event.preventDefault();
    setMessage(
      "You’ve reached the end of the intro. This preview is ready to connect to SkillTrade’s login.",
    );
    event.currentTarget.reset();
  }
  return (
    <form onSubmit={submit}>
      <label htmlFor="intro-email">Email address</label>
      <input
        id="intro-email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <label htmlFor="intro-password">Password</label>
      <div className="password-field">
        <input
          id="intro-password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
        <button
          className="show"
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <button className="primary" type="submit">
        Log in
      </button>
      <div className="message" role="status">
        {message}
      </div>
    </form>
  );
}
function DiscoverChapter() {
  return (
    <section className="chapter" id="discover" aria-label="Discover skills">
      <div className="copy reveal">
        <div className="eyebrow">A little curiosity goes a long way</div>
        <h1>
          That thing you
          <br />
          always wanted
          <br />
          to <em>learn.</em>
        </h1>
        <p className="description">
          Someone nearby can teach you. Discover skills, meet your people, and
          try something new.
        </p>
        <div className="hint">
          <span className="scroll-symbol" aria-hidden="true"></span>Scroll to
          explore
        </div>
      </div>
      <div className="visual reveal">
        <div className="skill tile">
          <div className="float-tag">Your next “I did that.”</div>
          <div className="skill-top">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <path d="M24 73V27h30v46M54 38h22v35M18 73h64M34 37h9M34 48h9M34 59h9M64 48h4M64 59h4"></path>
            </svg>
          </div>
          <div className="tag">Explore a new skill</div>
          <h3>Photography basics</h3>
          <div className="details">
            <span>Beginner friendly</span>
            <span>In person</span>
          </div>
        </div>
        <div className="mini-tile tile">
          <div className="icon">
            <svg viewBox="0 0 24 24">
              <path d="M9 18V5l10-2v13M9 8l10-2"></path>
              <ellipse cx="6" cy="18" rx="3" ry="2"></ellipse>
              <ellipse cx="16" cy="16" rx="3" ry="2"></ellipse>
            </svg>
          </div>
          <b>Your first guitar chords</b>
          <span>One session. A new beginning.</span>
        </div>
      </div>
    </section>
  );
}

function ShareChapter() {
  return (
    <section className="chapter" id="share" aria-label="Share your skills">
      <div className="copy reveal">
        <div className="eyebrow">You have something to share</div>
        <h2>
          Be a learner.
          <br />
          Be a <em>teacher.</em>
          <br />
          Be both.
        </h2>
        <p className="description">
          The things you know can open doors for someone else. Share a skill,
          then learn one in return.
        </p>
      </div>
      <div className="visual reveal">
        <div className="trade-stack">
          <div className="tile trade-card">
            <div className="row">
              <div className="avatar">You</div>
              <div>
                <h3>What you can teach</h3>
                <p>A skill you love sharing</p>
              </div>
            </div>
            <span className="pill">Share what you know</span>
          </div>
          <div className="connector" aria-hidden="true">
            ⇄
          </div>
          <div className="tile trade-card">
            <div className="row">
              <div className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="m12 3 2.5 6 6.5 3-6.5 3-2.5 6-2.5-6L3 12l6.5-3Z"></path>
                </svg>
              </div>
              <div>
                <h3>What you want to learn</h3>
                <p>Something you’ve been curious about</p>
              </div>
            </div>
            <span className="pill">Make room for something new</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PointsChapter() {
  return (
    <section className="chapter" id="points" aria-label="How skill points work">
      <div className="copy reveal">
        <div className="eyebrow">Good things come back around</div>
        <h2>
          Give a skill.
          <br />
          Get <em>possibilities.</em>
        </h2>
        <p className="description">
          Teach to earn skill points. Use your points to book sessions and keep
          your curiosity going.
        </p>
        <span className="small-note">
          Each listing shows its skill-point cost before you book.
        </span>
      </div>
      <div className="visual reveal">
        <div className="points">
          <b>✧</b>
          <span>Skill points</span>
        </div>
        <div className="point-label">
          Your next step<b>Find it. Book it. Learn it.</b>
        </div>
      </div>
    </section>
  );
}

function LoginChapter({ onReplay }) {
  return (
    <section className="chapter final" id="login" aria-label="Login">
      <div className="copy reveal">
        <div className="eyebrow">Your next chapter</div>
        <h2>
          Come curious.
          <br />
          Leave with
          <br />
          <em>something new.</em>
        </h2>
        <p className="description">
          Your skills, your people, your next “I can do that.”
        </p>
        <button className="replay" onClick={onReplay}>
          Replay the introduction
        </button>
      </div>
      <div className="visual reveal">
        <div className="tile login-wrap">
          <h3>Welcome to SkillTrade</h3>
          <p>Log in to keep learning.</p>
          <LoginForm />
          <div className="prototype">
            New to SkillTrade? <a href="signup">Create an account</a>
          </div>
        </div>
      </div>
    </section>
  );
}

const labels = [
  "Discover skills",
  "Share your skills",
  "Skill points",
  "Login",
];

export default function Intro() {
  const root = useRef(null);
  const [current, setCurrent] = useState(0);
  const [ripples, setRipples] = useState([]);
  const nextRipple = useRef(0);
  const timers = useRef(new Set());

  function ripple(x, y) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = nextRipple.current++;
    setRipples((items) => [...items, { id, x, y }]);
    const timer = setTimeout(() => {
      setRipples((items) => items.filter((item) => item.id !== id));
      timers.current.delete(timer);
    }, 1550);
    timers.current.add(timer);
  }

  function go(index) {
    root.current.querySelectorAll(".chapter")[index].scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    const element = root.current;
    const chapters = [...element.querySelectorAll(".chapter")];
    const rings = [...element.querySelectorAll(".ring")];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pendingTimers = timers.current;
    let frame = null;
    let active = 0;
    function update() {
      frame = null;
      const y = window.scrollY;
      let index = 0;
      chapters.forEach((chapter, i) => {
        if (chapter.getBoundingClientRect().top <= window.innerHeight * 0.5)
          index = i;
      });
      if (index !== active) {
        active = index;
        if (!motion.matches) {
          const id = nextRipple.current++;
          setRipples((items) => [
            ...items,
            { id, x: window.innerWidth * 0.64, y: window.innerHeight * 0.48 },
          ]);
          const timer = setTimeout(() => {
            setRipples((items) => items.filter((item) => item.id !== id));
            pendingTimers.delete(timer);
          }, 1550);
          pendingTimers.add(timer);
        }
      }
      setCurrent(index);
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      element.querySelector(".progress").style.width =
        `${distance > 0 ? Math.min(100, Math.max(0, (y / distance) * 100)) : 0}%`;
      rings.forEach((ring, i) => {
        ring.style.transform = motion.matches
          ? ""
          : `translate(-50%,-50%) scale(${1 + i * 0.35 + ((y / window.innerHeight) % 1) * 0.22}) rotate(${y * 0.01}deg)`;
      });
    }
    function schedule() {
      if (frame === null) frame = requestAnimationFrame(update);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.target.classList.toggle("is-visible", entry.isIntersecting),
        );
      },
      { threshold: 0.16 },
    );
    chapters.forEach((chapter) => observer.observe(chapter));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
      pendingTimers.forEach(clearTimeout);
      pendingTimers.clear();
    };
  }, []);

  return (
    <div className="skilltrade-intro" ref={root}>
      <div className="ambient" aria-hidden="true" />
      <div className="rings" aria-hidden="true">
        {[1, 1.35, 1.7, 2.05].map((scale) => (
          <div className="ring" key={scale} style={{ "--scale": scale }} />
        ))}
      </div>
      <header>
        <div className="brand">
          <span className="mark">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 11h20M22 7l4 4-4 4M26 21H6M10 17l-4 4 4 4" />
            </svg>
          </span>
          SkillTrade
        </div>
        <button
          className="skip"
          style={{ visibility: current === 3 ? "hidden" : "visible" }}
          onClick={() => go(3)}
        >
          Skip intro
        </button>
      </header>
      <main>
        <DiscoverChapter />
        <ShareChapter />
        <PointsChapter />
        <LoginChapter onReplay={() => go(0)} />
      </main>
      <nav className="pagination" aria-label="Introduction chapters">
        {labels.map((label, index) => (
          <button
            key={label}
            className={current === index ? "active" : ""}
            aria-label={label}
            aria-current={current === index ? "step" : undefined}
            onClick={() => go(index)}
          />
        ))}
        <span className="chapter-count">0{current + 1} / 04</span>
      </nav>
      {current !== 3 && (
        <button
          className="next"
          onClick={(event) => {
            ripple(event.clientX, event.clientY);
            go(Math.min(3, current + 1));
          }}
        >
          Keep exploring
        </button>
      )}
      <div className="progress" aria-hidden="true" />
      {ripples.map((item) => (
        <div
          key={item.id}
          className="ripple"
          aria-hidden="true"
          style={{ "--x": `${item.x}px`, "--y": `${item.y}px` }}
        />
      ))}
    </div>
  );
}
