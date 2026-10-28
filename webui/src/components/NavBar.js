import { NavLink } from 'react-router-dom';
import styles from '../styles/navbar.module.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', className: styles.navHome, end: true },
  { to: '/explore', label: 'Explore', className: styles.navExplore },
  { to: '/sessions', label: 'Sessions', className: styles.navSessions },
  { to: '/teach', label: 'Teach a skill', className: styles.navTeach },
];

// The points and initals attributed to the account can be entered as parameters 
export default function NavBar({ points = 0, initials = '' }) {
  return (
    
    <div className={styles.headerRow}>
      {NAV_LINKS.map(({ to, label, className, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `${styles.navItem} ${className} ${isActive ? styles.navActive : ''}`
          }
        >
          {label}
        </NavLink>
      ))}
      <div className={styles.pointsFaq}>
        <div className={styles.sparkleIcon} />
        <span className={styles.pointsBalance}>{points} points</span>
      </div>

      <div className={styles.headerActions}>
        <div className={styles.notificationButton}>
          <div className={styles.bellIcon} />
        </div>
        <div className={styles.profileButton}>
          <span className={styles.profileInitials}>{initials}</span>
        </div>
      </div>

    </div>
  );
}