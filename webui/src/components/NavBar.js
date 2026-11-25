import { Link, NavLink } from 'react-router-dom';
import styles from '../styles/navbar.module.css';
import Bell from '../styles/icons/Notification.svg';
import Sparkle from '../styles/icons/NavBar-Sparkle.svg';

const NAV_LINKS = [
  { to: '/homepage', label: 'Home', end: true },
  { to: '/explore', label: 'Explore' },
  { to: '/sessions', label: 'Sessions' },
  { to: '/teach', label: 'Teach a skill' },

];

// The points and initials attributed to the account can be entered as parameters
export default function NavBar({ points = 0, initials = '' }) {
  return (
    <div className={styles.headerRow}>
      {NAV_LINKS.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `${styles.navItem}${isActive ? ` ${styles.navActive}` : ''}`
          }
        >
          <span className={styles.navLabel}>{label}</span>
        </NavLink>
      ))}

      <div className={styles.pointsFaq}>
        <img className={styles.sparkleIcon} src={Sparkle} alt="" />
        <span className={styles.pointsBalance}>{points} points</span>
      </div>

      <div className={styles.headerActions}>
        <Link to="/notifications" className={styles.notificationButton} aria-label="Notifications">
          <img className={styles.bellIcon} src={Bell} alt="" />
        </Link>

        <Link to="/profile" className={styles.profileButton} aria-label="Your profile">
          <span className={styles.profileInitials}>{initials}</span>
        </Link>
      </div>
    </div>
  );
}