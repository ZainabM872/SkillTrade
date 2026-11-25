
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/review_listing.module.css';
import NavBar from '../components/NavBar';
import guitarIcon from '../styles/icons/guitar.svg';
import skateIcon from '../styles/icons/skate.svg';
import greyCircle from '../styles/icons/Ellipse-1.svg';
import whiteCircle from '../styles/icons/Ellipse.svg';

const MOCK_CURRENT_USER = {
  id: 6,
  name: 'Sara Moon',
  points: 120,
  city: 'Calgary'
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

const CATEGORY_ICONS = {
  music: guitarIcon,
  sports: skateIcon
};

const DIFFICULTIES = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced'
};

const SKILL_ROUTE = '/teach';
const AVAILABILITY_ROUTE = '/teach/availability';
const MEETING_ROUTE = '/teach/meeting-details';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

function getPoints(minutes) {
  const points = (minutes / 60) * POINTS_PER_HOUR;
  return Number.isInteger(points) ? points : points.toFixed(1);
}

function formatTime(value) {
  return new Date(`1970-01-01T${value}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

function describeFormat(format, city) {
  if (format === 'online') return 'Online';
  if (format === 'both') return `In person in ${city} & online`;
  if (format === 'in-person') return `In person in ${city}`;
  return 'Not specified';
}

export default function ReviewListing({
  currentUser = MOCK_CURRENT_USER
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');

  const {
    skill,
    duration,
    availability,
    meetingLocations
  } = location.state ?? {};

  // Keep all listing information together so each Edit link
  // can pass it to the page being edited.
  const editState = {
    skill,
    duration,
    availability,
    meetingLocations
  };

  const listing = {
    ...(skill ?? {}),
    duration: duration ?? null,
    availability: availability ?? {},
    meetingLocations: (meetingLocations ?? []).map((item) => ({
      name: item.name,
      details: item.note ?? item.details ?? ''
    }))
  };

  const categoryLabel =
    CATEGORIES[listing.category] ?? listing.category ?? 'Other';

  const difficultyLabel =
    DIFFICULTIES[listing.difficulty] ?? 'Not specified';

  const icon = CATEGORY_ICONS[listing.category];

  const points = listing.duration
    ? getPoints(listing.duration)
    : 0;

  const availabilityLines = DAYS
    .filter((day) => listing.availability[day]?.length)
    .map((day) => ({
      day,
      times: listing.availability[day].map(formatTime)
    }));

  const hasAvailability = availabilityLines.length > 0;
  const hasLocations = listing.meetingLocations.length > 0;

  async function handlePublish() {
    setIsPublishing(true);
    setPublishError('');

    const payload = {
      teacher_id: currentUser.id,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      difficulty: listing.difficulty,
      experience_level: null,
      format: listing.format,
      duration_minutes: Number(listing.duration),
      point_cost: Number(points),
      availability: listing.availability,
      meetingLocations: listing.meetingLocations
    };

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not publish your listing.');
      }

      // The listing is saved. Go to Explore to see it.
      navigate('/explore');
    } catch (error) {
      setPublishError(
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <>
      <NavBar
        points={currentUser.points}
        initials={getInitials(currentUser.name)}
      />

      <main className={styles.page}>
        <div className={styles.container}>

          <header className={styles.header}>
            <p className={styles.eyebrow}>READY TO SHARE?</p>
            <h1 className={styles.title}>Review your listing</h1>
            <p className={styles.subtitle}>
              Check all your details before publishing your skill
              to the SkillTrade community.
            </p>
          </header>

          <div className={styles.layout}>

            {/* Listing preview */}
            <article className={styles.preview} aria-label="Listing preview">
              <div className={styles.banner}>
                <img className={styles.bannerGrey} src={greyCircle} alt="" />
                <img className={styles.bannerWhite} src={whiteCircle} alt="" />

                {icon && (
                  <img className={styles.bannerIcon} src={icon} alt="" />
                )}

                <span className={styles.bannerLabel}>
                  {categoryLabel}
                </span>
              </div>

              <div className={styles.previewBody}>
                <h2 className={styles.previewTitle}>
                  {listing.title || 'Untitled skill'}
                </h2>

                <p className={styles.previewMeta}>
                  {currentUser.name} · {describeFormat(
                    listing.format,
                    currentUser.city
                  )}
                </p>

                <p className={styles.previewTags}>
                  {difficultyLabel}
                </p>

                <p className={styles.previewPoints}>
                  {points} points
                </p>
              </div>
            </article>

            {/* Listing details */}
            <div className={styles.details}>

              {/* Skill information */}
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    Skill information
                  </h2>

                  <Link
                    className={styles.editLink}
                    to={SKILL_ROUTE}
                    state={editState}
                  >
                    Edit
                  </Link>
                </div>

                <p className={styles.cardText}>
                  <strong>Title:</strong> {listing.title || 'Not provided'}
                </p>

                <p className={styles.cardText}>
                  <strong>Category:</strong> {categoryLabel}
                </p>

                <p className={styles.cardText}>
                  <strong>Difficulty:</strong> {difficultyLabel}
                </p>

                <p className={styles.cardText}>
                  <strong>Format:</strong>{' '}
                  {describeFormat(listing.format, currentUser.city)}
                </p>

                <p className={styles.cardText}>
                  <strong>Description:</strong>{' '}
                  {listing.description || 'No description provided.'}
                </p>
              </section>

              {/* Availability */}
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    Availability &amp; points
                  </h2>

                  <Link
                    className={styles.editLink}
                    to={AVAILABILITY_ROUTE}
                    state={editState}
                  >
                    Edit
                  </Link>
                </div>

                {hasAvailability ? (
                  <>
                    {availabilityLines.map(({ day, times }) => (
                      <p className={styles.cardText} key={day}>
                        <strong>{day}:</strong> {times.join(', ')}
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

              {/* Meeting locations */}
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    Meeting locations
                  </h2>

                  <Link
                    className={styles.editLink}
                    to={MEETING_ROUTE}
                    state={editState}
                  >
                    Edit
                  </Link>
                </div>

                {hasLocations ? (
                  listing.meetingLocations.map(({ name, details }, index) => (
                    <p className={styles.cardText} key={`${name}-${index}`}>
                      <strong>{name}</strong>
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

          {publishError && (
            <p role="alert" className={styles.cardText}>
              {publishError}
            </p>
          )}

          <button
            type="button"
            className={styles.publishButton}
            onClick={handlePublish}
            disabled={
              isPublishing ||
              !listing.title ||
              !duration ||
              !hasAvailability ||
              !hasLocations
            }
          >
            {isPublishing ? 'Publishing...' : 'Publish skill'}
          </button>

        </div>
      </main>
    </>
  );
}
