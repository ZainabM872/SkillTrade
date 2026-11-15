import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/notifications.module.css";
import NavBar from "../components/NavBar";

// Temporary data (replace with backend response)

// Current user logged in (used for the nav bar)
const MOCK_CURRENT_USER = { id: "usr_001", name: "Sara Moon", points: 120 };

// Each notification has a title, a message, and a button that goes somewhere.
const MOCK_NOTIFICATIONS = [
  {
    id: "ntf_001",
    title: "Your listing is approved",
    message: "Skating basics is ready for learners to discover.",
    actionLabel: "View listing",
    to: "/mylisting", // point to listing page
  },
  {
    id: "ntf_002",
    title: "A session is coming up",
    message:
      "Acoustic guitar · November 15 at 11:00 AM · Community centre lobby",
    actionLabel: "View session",
    to: "/sessions/ses_001",
  },
];

// Notifications for the logged-in user.

async function fetchNotifications(userId) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_NOTIFICATIONS), 300),
  );
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

export default function Notifications({ currentUser = MOCK_CURRENT_USER }) {
  const userId = currentUser.id;
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchNotifications(userId)
      .then((data) => !cancelled && setNotifications(data))
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <>
      <NavBar
        points={currentUser.points}
        initials={getInitials(currentUser.name)}
      />

      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Your SkillTrade updates</p>
            <h1 className={styles.title}>Notifications</h1>
            <p className={styles.subtitle}>
              Stay up to date with your sessions and listings.
            </p>
          </header>

          <section aria-live="polite" aria-busy={isLoading}>
            {isLoading && (
              <p className={styles.status}>Loading your notifications…</p>
            )}

            {error && (
              <p className={styles.status} role="alert">
                We couldn’t load your notifications. Refresh the page to try
                again.
              </p>
            )}

            {!isLoading && !error && notifications.length === 0 && (
              <p className={styles.status}>
                You’re all caught up. New updates will show up here.
              </p>
            )}

            {notifications.length > 0 && (
              <ul className={styles.list}>
                {notifications.map(
                  ({ id, title, message, actionLabel, to }) => (
                    <li key={id}>
                      <article className={styles.card}>
                        <div className={styles.text}>
                          <h2 className={styles.cardTitle}>{title}</h2>
                          <p className={styles.cardMessage}>{message}</p>
                        </div>
                        <Link to={to} className={styles.actionButton}>
                          {actionLabel}
                        </Link>
                      </article>
                    </li>
                  ),
                )}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
