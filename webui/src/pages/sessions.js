import { useEffect, useMemo, useState } from 'react';
import styles from '../styles/sessions.module.css';
import NavBar from '../components/NavBar';
import guitarIcon from '../styles/icons/guitar.svg';
import skateIcon from '../styles/icons/skate.svg';
import greyCircle from '../styles/icons/Ellipse-1.svg'; // change to your file names
import whiteCircle from '../styles/icons/Ellipse.svg';

// Temporary data (replace with backend response)

// Current user logged in. Only the id is used to find their sessions;
// the name is used for the initials in the nav bar and the points are mock data.
const MOCK_CURRENT_USER = { id: 'usr_001', name: 'Sara Moon', points: 120 };

// Each session lists both people. If the logged in user is one of them, it will display on screen
// with the appropriate labels.
// Each session also has an `icon`: an image URL (here, the imported SVG files).
// Later this can be whatever the backend sends.
// Temporary mock sessions
const MOCK_SESSIONS = [
  {
    id: 'ses_001',
    status: 'confirmed',
    title: 'Acoustic guitar',
    icon: guitarIcon,
    category: { id: 'music', label: 'Music' },
    teacher: { id: 'usr_002', name: 'Alex Morgan' },
    learner: { id: 'usr_001', name: 'Sara Moon' },
    startsAt: '2026-11-15T11:00:00',
    endsAt: '2026-11-15T12:00:00',
    location: null,
  },
  {
    id: 'ses_002',
    status: 'confirmed',
    title: 'Skating basics',
    icon: skateIcon,
    category: { id: 'sports', label: 'Sports & Movement' },
    teacher: { id: 'usr_001', name: 'Sara Moon' },
    learner: { id: 'usr_004', name: 'Jordan Lee' },
    startsAt: '2026-11-15T11:00:00',
    endsAt: '2026-11-15T12:00:00',
    location: 'Community centre lobby · Calgary',
  },
];

// return the appropriate sessions to display
async function fetchSessions(userId) {
  const mine = MOCK_SESSIONS.filter(
    (s) => s.teacher.id === userId || s.learner.id === userId
  );
  return new Promise((resolve) => setTimeout(() => resolve(mine), 300));
}

const TIME_FILTERS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

const ROLE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'learning', label: 'Learning' },
  { value: 'teaching', label: 'Teaching' },
];

const ROLE_LABELS = { learning: 'Learning', teaching: 'Teaching' };
const STATUS_LABELS = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

const TIME_OPTIONS = { hour: 'numeric', minute: '2-digit' };

// format the timestamps
function formatWhen(startsAt, endsAt) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const dateOptions = { month: 'long', day: 'numeric' };
  if (start.getFullYear() !== new Date().getFullYear()) dateOptions.year = 'numeric';

  const date = start.toLocaleDateString('en-US', dateOptions);
  const from = start.toLocaleTimeString('en-US', TIME_OPTIONS);
  const to = end.toLocaleTimeString('en-US', TIME_OPTIONS);
  return `${date} · ${from}–${to}`;
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

// Adds the user's role and the other person in the session.
function withRole(session, userId) {
  const isTeaching = session.teacher.id === userId;
  return {
    ...session,
    role: isTeaching ? 'teaching' : 'learning',
    otherPerson: isTeaching ? session.learner : session.teacher,
  };
}

function formatOtherPerson({ role, otherPerson }) {
  return role === 'teaching' ? `with ${otherPerson.name}` : otherPerson.name;
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className={styles.filterGroup} role="group" aria-label={label}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            className={`${styles.pill}${isActive ? ` ${styles.active}` : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function CategoryThumb({ icon, category }) {
  return (
    <div className={styles.thumb}>
      <img className={styles.thumbGrey} src={greyCircle} alt="" />
      <img className={styles.thumbWhite} src={whiteCircle} alt="" />
      {icon && <img className={styles.thumbIcon} src={icon} alt="" />}
      <span className={styles.thumbLabel}>{category.label}</span>
    </div>
  );
}

function SessionCard({ session, onView }) {
  const { title, icon, role, status, startsAt, endsAt, location, category } = session;
  return (
    <article className={styles.card}>
      <CategoryThumb icon={icon} category={category} />

      <div className={styles.cardBody}>
        <p className={styles.cardMeta}>
          {ROLE_LABELS[role]} · {STATUS_LABELS[status] ?? status}
        </p>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.cardPerson}>{formatOtherPerson(session)}</p>
        <p className={styles.cardDetails}>
          {formatWhen(startsAt, endsAt)}
          {location && (
            <>
              <br />
              {location}
            </>
          )}
        </p>
      </div>

      <button type="button" className={styles.viewButton} onClick={() => onView?.(session)}>
        View session
      </button>
    </article>
  );
}

/* ---------- Page ---------- */

export default function SessionsPage({ currentUser = MOCK_CURRENT_USER, onViewSession }) {
  const userId = currentUser.id;
  const [when, setWhen] = useState('upcoming');
  const [role, setRole] = useState('all');
  const [allSessions, setAllSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchSessions(userId)
      .then((data) => !cancelled && setAllSessions(data))
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const sessions = useMemo(() => {
    const now = Date.now();
    return allSessions
      .map((s) => withRole(s, userId))
      .filter((s) => {
        const isUpcoming = new Date(s.endsAt).getTime() >= now;
        return when === 'upcoming' ? isUpcoming : !isUpcoming;
      })
      .filter((s) => role === 'all' || s.role === role)
      .sort((a, b) => {
        const diff = new Date(a.startsAt) - new Date(b.startsAt);
        return when === 'upcoming' ? diff : -diff;
      });
  }, [allSessions, userId, when, role]);

  return (
    <>
      <NavBar points={currentUser.points} initials={getInitials(currentUser.name)} />

      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Make time for something new</p>
            <h1 className={styles.title}>Your sessions</h1>
            <p className={styles.subtitle}>Your plans to learn, teach, and connect.</p>
          </header>

          <div className={styles.filters}>
            <FilterGroup label="Time" options={TIME_FILTERS} value={when} onChange={setWhen} />
            <FilterGroup label="Role" options={ROLE_FILTERS} value={role} onChange={setRole} />
          </div>

          <section className={styles.list} aria-live="polite" aria-busy={isLoading}>
            {isLoading && <p className={styles.status}>Loading your sessions…</p>}

            {error && (
              <p className={styles.status} role="alert">
                We couldn’t load your sessions. Refresh the page to try again.
              </p>
            )}

            {!isLoading && !error && sessions.length === 0 && (
              <p className={styles.status}>
                {when === 'upcoming'
                  ? 'No upcoming sessions yet. Explore skills to book your first one.'
                  : 'No past sessions to show.'}
              </p>
            )}

            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} onView={onViewSession} />
            ))}
          </section>

          <aside className={styles.note}>
            <h3 className={styles.noteHeading}>A little preparation goes a long way</h3>
            <p className={styles.noteText}>
              Check the meeting instructions and arrive on time. Cancel or reschedule at least 48
              hours in advance.
            </p>
          </aside>
        </div>
      </main>
    </>
  );
}