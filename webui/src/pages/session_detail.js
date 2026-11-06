import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from '../styles/sessionDetails.module.css';
import NavBar from '../components/NavBar';
import guitarIcon from '../styles/icons/guitar.svg';
import skateIcon from '../styles/icons/skate.svg';
import greyCircle from '../styles/icons/Ellipse-1.svg'; // change to your file names
import whiteCircle from '../styles/icons/Ellipse.svg';

// Temporary data (replace with backend response)

// Current id of the user logged in
const MOCK_CURRENT_USER = { id: 'usr_001', name: 'Sara Moon', points: 120 };

// Details for each session. The ids match the sessions on the Sessions page,
// so "View session" opens the right one at /sessions/:id.
const MOCK_SESSIONS = [
  {
    id: 'ses_001',
    status: 'confirmed',
    title: 'Acoustic guitar',
    icon: guitarIcon,
    category: { id: 'music', label: 'Music' },
    teacher: { id: 'usr_002', name: 'Alex Morgan', rating: 4.9, reliability: 96 },
    learner: { id: 'usr_001', name: 'Sara Moon', rating: 5.0, reliability: 100 },
    startsAt: '2026-11-15T11:00:00',
    endsAt: '2026-11-15T12:00:00',
    location: 'Community centre lobby · Calgary',
    meetingInstructions: 'Meet by the reception desk in the lobby.',
    durationMinutes: 60,
    points: 15,
  },
  {
    id: 'ses_002',
    status: 'confirmed',
    title: 'Skating basics',
    icon: skateIcon,
    category: { id: 'sports', label: 'Sports & Movement' },
    teacher: { id: 'usr_001', name: 'Sara Moon', rating: 4.8, reliability: 98 },
    learner: { id: 'usr_004', name: 'Jordan Lee', rating: 4.7, reliability: 92 },
    startsAt: '2026-11-15T11:00:00',
    endsAt: '2026-11-15T12:00:00',
    location: 'Community centre lobby · Calgary',
    meetingInstructions: 'Meet at the rink entrance. Wear warm layers and bring gloves.',
    durationMinutes: 60,
    points: 15,
  },
];

// One session by id, or null if it doesn't exist or the user isn't part of it.
// Real version: GET /api/sessions/:id
async function fetchSession(sessionId, userId) {
  const session = MOCK_SESSIONS.find(
    (s) => s.id === sessionId && (s.teacher.id === userId || s.learner.id === userId)
  );
  return new Promise((resolve) => setTimeout(() => resolve(session ?? null), 300));
}

const ROLE_LABELS = { learning: 'Learning', teaching: 'Teaching' };
const STATUS_LABELS = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

const TIME_OPTIONS = { hour: 'numeric', minute: '2-digit' };

// "November 15, 2026 · 11:00 AM–12:00 PM"
function formatWhen(startsAt, endsAt) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const date = start.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const from = start.toLocaleTimeString('en-US', TIME_OPTIONS);
  const to = end.toLocaleTimeString('en-US', TIME_OPTIONS);
  return `${date} · ${from}–${to}`;
}

// Adds the user's role and the other person in the session.
function withRole(session, userId) {
  const isTeaching = session.teacher.id === userId;
  return {
    ...session,
    role: isTeaching ? 'teaching' : 'learning',
    otherPerson: isTeaching ? session.learner : session.teacher,
  };
}

// "Alex Morgan · ★ 4.9 · 96% reliable" (rating and reliability are skipped if missing)
function formatPersonLine({ name, rating, reliability }) {
  const parts = [name];
  if (rating != null) parts.push(`★ ${rating.toFixed(1)}`);
  if (reliability != null) parts.push(`${reliability}% reliable`);
  return parts.join(' · ');
}

// "Sara Moon" -> "SM"
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

/* ---------- Page ---------- */

export default function SessionDetails({ currentUser = MOCK_CURRENT_USER }) {
  const { id } = useParams();
  const userId = currentUser.id;
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchSession(id, userId)
      .then((data) => !cancelled && setSession(data ? withRole(data, userId) : null))
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, userId]);

  return (
    <>
      <NavBar points={currentUser.points} initials={getInitials(currentUser.name)} />

      <main className={styles.page}>
        <div className={styles.container}>
          {isLoading && <p className={styles.status}>Loading session…</p>}

          {error && (
            <p className={styles.status} role="alert">
              We couldn’t load this session. Refresh the page to try again.
            </p>
          )}

          {!isLoading && !error && !session && (
            <p className={styles.status}>
              We couldn’t find that session. <Link to="/sessions">Back to sessions</Link>
            </p>
          )}

          {session && <SessionContent session={session} />}
        </div>
      </main>
    </>
  );
}

function SessionContent({ session }) {
  const {
    title,
    icon,
    role,
    status,
    category,
    otherPerson,
    startsAt,
    endsAt,
    location,
    meetingInstructions,
    durationMinutes,
    points,
  } = session;

  // Arrival, location sharing, reschedule and cancel only make sense for confirmed sessions.
  const isConfirmed = status === 'confirmed';

  return (
    <>
      <header className={styles.headerGrid}>
        <div>
          <p className={styles.eyebrow}>
            {STATUS_LABELS[status] ?? status} · {ROLE_LABELS[role]}
          </p>
          <h1 className={styles.title}>
            {title} with {otherPerson.name}
          </h1>
          <p className={styles.when}>{formatWhen(startsAt, endsAt)}</p>
        </div>
        <Link to="/sessions" className={styles.backLink}>
          ← Back to sessions
        </Link>
      </header>

      <div className={styles.layout}>
        {/* TODO: hook the buttons up to the backend */}
        <section className={`${styles.card} ${styles.mainCard}`}>
          <div className={styles.banner}>
            <img className={styles.bannerGrey} src={greyCircle} alt="" />
            <img className={styles.bannerWhite} src={whiteCircle} alt="" />
            {icon && <img className={styles.bannerIcon} src={icon} alt="" />}
            <span className={styles.bannerLabel}>{category.label}</span>
          </div>

          <div className={styles.details}>
            <h2 className={styles.sectionTitle}>Your meeting details</h2>
            <p className={styles.location}>{location ?? 'Location to be confirmed'}</p>
            {meetingInstructions && <p className={styles.instructions}>{meetingInstructions}</p>}
            <p className={styles.meta}>
              {formatPersonLine(otherPerson)}
              <br />
              {durationMinutes} minutes · {points} points
            </p>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} disabled={!isConfirmed}>
              I’ve arrived
            </button>
            <button type="button" className={styles.secondaryButton} disabled={!isConfirmed}>
              Share location
            </button>
          </div>
        </section>

        <aside className={`${styles.card} ${styles.sideCard}`}>
          <h2 className={styles.sideTitle}>Keep your plans up to date</h2>
          <p className={styles.sideText}>
            Need to make a change? Give your learning partner at least 48 hours’ notice.
          </p>

          <div className={styles.sideActions}>
            <button type="button" className={styles.secondaryButton} disabled={!isConfirmed}>
              Reschedule session
            </button>
            <button type="button" className={styles.secondaryButton} disabled={!isConfirmed}>
              Cancel session
            </button>
            <button type="button" className={styles.secondaryButton}>
              Report a problem
            </button>
          </div>

          {/* TODO: point this at your reliability explainer page */}
          <a className={styles.textLink} href="/reliability">
            How reliability works ↗
          </a>
        </aside>
      </div>
    </>
  );
}