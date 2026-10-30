import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from '../styles/sessionDetails.module.css';
import NavBar from '../components/NavBar';
import greyCircle from '../styles/icons/grey-circle.svg'; // change to your file names
import whiteCircle from '../styles/icons/white-circle.svg';
import { MOCK_CURRENT_USER, fetchSession } from '../data/mockSessions';
import {
  ROLE_LABELS,
  STATUS_LABELS,
  formatWhen,
  getInitials,
  withRole,
} from '../utils/sessionUtils';

// "Alex Morgan · ★ 4.9 · 96% reliable" (rating and reliability are skipped if missing)
function formatPersonLine({ name, rating, reliability }) {
  const parts = [name];
  if (rating != null) parts.push(`★ ${rating.toFixed(1)}`);
  if (reliability != null) parts.push(`${reliability}% reliable`);
  return parts.join(' · ');
}

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

  // Arrival and location sharing only make sense for confirmed sessions.
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
          <p className={styles.when}>{formatWhen(startsAt, endsAt, { alwaysShowYear: true })}</p>
        </div>
        <Link to="/sessions" className={styles.backLink}>
          ← Back to sessions
        </Link>
      </header>

      <div className={styles.layout}>
        {/* TODO: hook the buttons below up to the backend */}
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