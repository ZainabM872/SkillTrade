import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "../styles/sessionDetails.module.css";
import PopupStyles from "../styles/cancel_reschedule.module.css";
import NavBar from "../components/NavBar";
import guitarIcon from "../styles/icons/guitar.svg";
import skateIcon from "../styles/icons/skate.svg";
import greyCircle from "../styles/icons/Ellipse-1.svg"; // change to your file names
import whiteCircle from "../styles/icons/Ellipse.svg";
import Sparkle from "../styles/icons/sparkle.svg";
import Cancel from "../styles/icons/Cancel_Button.svg";

// Temporary data (replace with backend response)

// Current id of the user logged in
const MOCK_CURRENT_USER = { id: "usr_001", name: "Sara Moon", points: 120 };

// path from reschedule
const BOOKING_ROUTE = "/booking";
// path after cancelling
const SESSIONS_ROUTE = "/sessions";

// Details for each session. The ids match the sessions on the Sessions page,
// so "View session" opens the right one at /sessions/:id.
const MOCK_SESSIONS = [
  {
    id: "ses_001",
    status: "confirmed",
    title: "Acoustic guitar",
    icon: guitarIcon,
    category: { id: "music", label: "Music" },
    teacher: {
      id: "usr_002",
      name: "Alex Morgan",
      rating: 4.9,
      reliability: 96,
    },
    learner: {
      id: "usr_001",
      name: "Sara Moon",
      rating: 5.0,
      reliability: 100,
    },
    startsAt: "2026-11-15T11:00:00",
    endsAt: "2026-11-15T12:00:00",
    location: "Community centre lobby · Calgary",
    meetingInstructions: "Meet by the reception desk in the lobby.",
    durationMinutes: 60,
    points: 15,
  },
  {
    id: "ses_002",
    status: "confirmed",
    title: "Skating basics",
    icon: skateIcon,
    category: { id: "sports", label: "Sports & Movement" },
    teacher: { id: "usr_001", name: "Sara Moon", rating: 4.8, reliability: 98 },
    learner: {
      id: "usr_004",
      name: "Jordan Lee",
      rating: 4.7,
      reliability: 92,
    },
    startsAt: "2026-11-15T11:00:00",
    endsAt: "2026-11-15T12:00:00",
    location: "Community centre lobby · Calgary",
    meetingInstructions:
      "Meet at the rink entrance. Wear warm layers and bring gloves.",
    durationMinutes: 60,
    points: 15,
  },
];

// One session by id, or null if it doesn't exist or the user isn't part of it.
// Real version: GET /api/sessions/:id
async function fetchSession(sessionId, userId) {
  const session = MOCK_SESSIONS.find(
    (s) =>
      s.id === sessionId &&
      (s.teacher.id === userId || s.learner.id === userId),
  );
  return new Promise((resolve) =>
    setTimeout(() => resolve(session ?? null), 300),
  );
}

// Marks a session as cancelled.
// Real version: POST /api/sessions/:id/cancel
async function cancelSession(sessionId) {
  const session = MOCK_SESSIONS.find((s) => s.id === sessionId);
  return new Promise((resolve) =>
    setTimeout(() => {
      if (session) session.status = "cancelled";
      resolve();
    }, 300),
  );
}

const ROLE_LABELS = { learning: "Learning", teaching: "Teaching" };
const STATUS_LABELS = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
  completed: "Completed",
};

const TIME_OPTIONS = { hour: "numeric", minute: "2-digit" };

// "November 15, 2026 · 11:00 AM–12:00 PM"
function formatWhen(startsAt, endsAt) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const date = start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const from = start.toLocaleTimeString("en-US", TIME_OPTIONS);
  const to = end.toLocaleTimeString("en-US", TIME_OPTIONS);
  return `${date} · ${from}–${to}`;
}

// Adds the user's role and the other person in the session.
function withRole(session, userId) {
  const isTeaching = session.teacher.id === userId;
  return {
    ...session,
    role: isTeaching ? "teaching" : "learning",
    otherPerson: isTeaching ? session.learner : session.teacher,
  };
}

// "Alex Morgan · ★ 4.9 · 96% reliable" (rating and reliability are skipped if missing)
function formatPersonLine({ name, rating, reliability }) {
  const parts = [name];
  if (rating != null) parts.push(`★ ${rating.toFixed(1)}`);
  if (reliability != null) parts.push(`${reliability}% reliable`);
  return parts.join(" · ");
}

// "Sara Moon" -> "SM"
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

// Function for Modal
// Popup shown for "Reschedule session" and "Cancel session".
// Closes with the X, the Escape key, or a click on the dark background.
function Modal({
  title,
  description,
  actionLabel,
  onAction,
  onClose,
  isBusy = false,
  error = "",
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // stop the page scrolling behind the popup
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.(); // give focus back to the button that opened the popup
    };
  }, []);

  return (
    <div
      className={PopupStyles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={PopupStyles.modal}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        tabIndex={-1}
      >
        <div className={PopupStyles.icon}>
          <img src={Sparkle} alt="" />
        </div>

        <button
          type="button"
          className={PopupStyles.close}
          aria-label="Close"
          onClick={onClose}
        >
          <img src={Cancel} alt="" />
        </button>

        <h2 className={PopupStyles.title} id="modal-title">
          {title}
        </h2>
        <p className={PopupStyles.text} id="modal-description">
          {description}
        </p>

        {error && (
          <p className={PopupStyles.error} role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className={PopupStyles.action}
          onClick={onAction}
          disabled={isBusy}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
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
      .then(
        (data) =>
          !cancelled && setSession(data ? withRole(data, userId) : null),
      )
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, userId]);

  return (
    <>
      <NavBar
        points={currentUser.points}
        initials={getInitials(currentUser.name)}
      />

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
              We couldn’t find that session.{" "}
              <Link to="/sessions">Back to sessions</Link>
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

  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(null); // 'reschedule' | 'cancel' | null
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  // Arrival, location sharing, reschedule and cancel only make sense for confirmed sessions.
  const isConfirmed = status === "confirmed";

  const closeModal = () => {
    if (isCancelling) return; // don't close while the cancellation is being sent
    setOpenModal(null);
    setCancelError("");
  };

  // "Choose date & time": go back to the booking page
  const handleReschedule = () => {
    navigate(BOOKING_ROUTE, { state: { rescheduleSessionId: session.id } });
  };

  // "Confirm cancellation": cancel the session, then go back to the list of sessions
  const handleCancel = async () => {
    setIsCancelling(true);
    setCancelError("");
    try {
      await cancelSession(session.id);
      setOpenModal("cancelled");
    } catch (err) {
      setCancelError("We couldn’t cancel this session. Please try again.");
      setIsCancelling(false);
    }
  };

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
            <p className={styles.location}>
              {location ?? "Location to be confirmed"}
            </p>
            {meetingInstructions && (
              <p className={styles.instructions}>{meetingInstructions}</p>
            )}
            <p className={styles.meta}>
              {formatPersonLine(otherPerson)}
              <br />
              {durationMinutes} minutes · {points} points
            </p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={!isConfirmed}
            >
              I’ve arrived
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={!isConfirmed}
            >
              Share location
            </button>
          </div>
        </section>

        <aside className={`${styles.card} ${styles.sideCard}`}>
          <h2 className={styles.sideTitle}>Keep your plans up to date</h2>
          <p className={styles.sideText}>
            Need to make a change? Give your learning partner at least 48 hours’
            notice.
          </p>

          <div className={styles.sideActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={!isConfirmed}
              onClick={() => setOpenModal("reschedule")}
            >
              Reschedule session
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={!isConfirmed}
              onClick={() => setOpenModal("cancel")}
            >
              Cancel session
            </button>
            <button type="button" className={styles.secondaryButton}>
              Report a problem
            </button>
          </div>

          <a className={styles.textLink} href="/reliability">
            How reliability works ↗
          </a>
        </aside>
      </div>

      {openModal === "reschedule" && (
        <Modal
          title="Choose a new time"
          description="Review available dates and times, then send your updated session request."
          actionLabel="Choose date & time"
          onAction={handleReschedule}
          onClose={closeModal}
        />
      )}

      {openModal === "cancel" && (
        <Modal
          title="Cancel this session?"
          description="Please give your learning partner at least 48 hours’ notice. The session will be marked cancelled."
          actionLabel={isCancelling ? "Cancelling…" : "Confirm cancellation"}
          onAction={handleCancel}
          onClose={closeModal}
          isBusy={isCancelling}
          error={cancelError}
        />
      )}
      {openModal === "cancelled" && (
        <Modal
          title="Session cancelled"
          description="Your learning partner will see the updated status in Sessions."
          actionLabel="Back to sessions"
          onAction={() => navigate(SESSIONS_ROUTE)}
          onClose={() => navigate(SESSIONS_ROUTE)}
        />
      )}
    </>
  );
}
