import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/review_listing.module.css';
import NavBar from '../components/NavBar';
import guitarIcon from '../styles/icons/guitar.svg';
import skateIcon from '../styles/icons/skate.svg';
import greyCircle from '../styles/icons/Ellipse-1.svg'; // change to your file names
import whiteCircle from '../styles/icons/Ellipse.svg';

// Temporary data (replace with backend response)
const MOCK_CURRENT_USER = { id: 'usr_001', name: 'Sara Moon', points: 120, city: 'Calgary' };

// Mock listing that was just created 
const MOCK_LISTING = {
  title: 'Skating basics',
  category: 'sports',
  difficulty: 'beginner',
  description: 'Beginner skating fundamentals, balance, and confidence on the ice.',
  format: 'in-person',
  tags: ['Balance', 'Confidence', 'Fundamentals'],
  duration: 60, // minutes
  availability: { Sat: ['10:00', '14:00'], Sun: ['10:00'] },
  meetingLocations: [
    { name: 'Community centre lobby', details: 'Reception desk' },
    { name: 'Public library', details: 'Second floor, by the elevators' },
  ],
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const POINTS_PER_HOUR = 15;

const CATEGORIES = {
  music: 'Music',
  sports: 'Sports & movement',
  food: 'Food & drink',
  art: 'Art',
  languages: 'Languages',
  technology: 'Technology',
  other: 'Other',
};

// Icon shown on the preview card for each category
const CATEGORY_ICONS = { music: guitarIcon, sports: skateIcon };

const DIFFICULTIES = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

// Where the "Add availability" and "Add location" links go
const AVAILABILITY_ROUTE = '/teach/availability';
const MEETING_ROUTE = '/teach/meeting-details';

// "Sara Moon" -> "SM"
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

// 30 minutes -> 7.5, 60 minutes -> 15, 90 minutes -> 22.5
function getPoints(minutes) {
  const points = (minutes / 60) * POINTS_PER_HOUR;
  return Number.isInteger(points) ? points : points.toFixed(1);
}

// "14:00" -> "2:00 PM"
function formatTime(value) {
  return new Date(`1970-01-01T${value}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

// "In person in Calgary", "Online", "In person in Calgary & online"
function describeFormat(format, city) {
  if (format === 'online') return 'Online';
  if (format === 'both') return `In person in ${city} & online`;
  return `In person in ${city}`;
}

/* ---------- Page ---------- */

export default function ReviewListing({ currentUser = MOCK_CURRENT_USER }) {
  // Answers from the earlier steps, if the user came through them
  const { skill, duration, availability, meetingLocations } = useLocation().state ?? {};
  const listing = {
    ...MOCK_LISTING,
    ...(skill ?? {}),
    duration: duration ?? MOCK_LISTING.duration,
    availability: availability ?? MOCK_LISTING.availability,
    meetingLocations: meetingLocations ?? MOCK_LISTING.meetingLocations,
  };

  const categoryLabel = CATEGORIES[listing.category] ?? listing.category;
  const icon = CATEGORY_ICONS[listing.category];
  const points = getPoints(listing.duration);
  const tags = listing.tags?.length ? listing.tags : [DIFFICULTIES[listing.difficulty]];

  const availabilityLines = DAYS.filter((day) => listing.availability[day]?.length).map(
    (day) => `${day} · ${listing.availability[day].map(formatTime).join(', ')}`
  );
  const hasAvailability = availabilityLines.length > 0;
  const hasLocations = listing.meetingLocations.length > 0;

  return (
    <>
      <NavBar points={currentUser.points} initials={getInitials(currentUser.name)} />

      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Ready to share?</p>
            <h1 className={styles.title}>Review your listing</h1>
            <p className={styles.subtitle}>
              Check the details, then publish your skill to your local community.
            </p>
          </header>

          <div className={styles.layout}>
            {/* How the listing will look to other people */}
            <article className={styles.preview} aria-label="Listing preview">
              <div className={styles.banner}>
                <img className={styles.bannerGrey} src={greyCircle} alt="" />
                <img className={styles.bannerWhite} src={whiteCircle} alt="" />
                {icon && <img className={styles.bannerIcon} src={icon} alt="" />}
                <span className={styles.bannerLabel}>{categoryLabel}</span>
              </div>

              <div className={styles.previewBody}>
                <h2 className={styles.previewTitle}>{listing.title}</h2>
                <p className={styles.previewMeta}>
                  {currentUser.name} · {describeFormat(listing.format, currentUser.city)}
                </p>
                <p className={styles.previewTags}>{tags.join(' · ')}</p>
                <p className={styles.previewPoints}>{points} points</p>
              </div>
            </article>

            <div className={styles.details}>
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>What learners can expect</h2>
                <p className={styles.cardText}>{listing.description}</p>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Availability &amp; points</h2>
                {hasAvailability ? (
                  <>
                    {availabilityLines.map((line) => (
                      <p className={styles.cardText} key={line}>
                        {line}
                      </p>
                    ))}
                    <p className={`${styles.cardText} ${styles.cardSummary}`}>
                      {listing.duration} minutes · {points} points
                    </p>
                  </>
                ) : (
                  <p className={styles.cardText}>
                    Select your days and save at least one start time.{' '}
                    <Link className={styles.inlineLink} to={AVAILABILITY_ROUTE} state={{ skill: listing, duration: listing.duration, availability: listing.availability }}>
                      Add availability
                    </Link>
                  </p>
                )}
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Meeting locations</h2>
                {hasLocations ? (
                  listing.meetingLocations.map(({ name, details }) => (
                    <p className={styles.cardText} key={name}>
                      {name}
                      {details && ` · ${details}`}
                    </p>
                  ))
                ) : (
                  <p className={styles.cardText}>
                    Add at least one place to meet.{' '}
                    <Link className={styles.inlineLink} to={MEETING_ROUTE} state={{ skill: listing, duration: listing.duration, availability: listing.availability }}>
                      Add location
                    </Link>
                  </p>
                )}
              </section>
            </div>
          </div>

          {/* Display only for now. TODO: hook this up when publishing is ready */}
          <button type="button" className={styles.publishButton}>
            Publish skill
          </button>
        </div>
      </main>
    </>
  );
}