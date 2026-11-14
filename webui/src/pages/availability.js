import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/availability.module.css';
import NavBar from '../components/NavBar';

// Temporary data (replace with backend response)
// Current user logged in (used for the nav bar)
const MOCK_CURRENT_USER = { id: 'usr_001', name: 'Sara Moon', points: 120 };

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DURATIONS = [30, 60, 90]; // minutes
const POINTS_PER_HOUR = 15;

const DEFAULT_HINT = 'Select your days and save at least one start time.';

// Where "Continue to meeting details" goes next (this route still needs to be created)
const NEXT_ROUTE = '/teach/meeting-details';


function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

// Calculate the points 
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


export default function Availability({ currentUser = MOCK_CURRENT_USER }) {
  const navigate = useNavigate();
  // The skill from the previous step ("Teach a new skill"), if the user came from there
  const skill = useLocation().state?.skill ?? null;

  const [duration, setDuration] = useState(60);
  const [selectedDays, setSelectedDays] = useState([]);
  const [availability, setAvailability] = useState({}); 
  const [isEditingTimes, setIsEditingTimes] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [showPointsHelp, setShowPointsHelp] = useState(false);
  const [message, setMessage] = useState(''); // validation message, shown under the button

  // Selected days in week order (Mon to Sun)
  const selectedList = DAYS.filter((day) => selectedDays.includes(day));

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    setMessage('');
  };

  const toggleTimesEditor = () => {
    if (selectedList.length === 0) {
      setMessage('Select at least one day first.');
      return;
    }
    setMessage('');
    setIsEditingTimes((open) => !open);
  };

  // Adds the chosen start time to every selected day
  const saveTime = () => {
    if (!newTime) {
      setMessage('Pick a start time.');
      return;
    }
    setAvailability((prev) => {
      const next = { ...prev };
      selectedList.forEach((day) => {
        const times = new Set(next[day] ?? []);
        times.add(newTime);
        next[day] = [...times].sort();
      });
      return next;
    });
    setNewTime('');
    setMessage('');
  };

  const removeTime = (day, time) => {
    setAvailability((prev) => ({ ...prev, [day]: (prev[day] ?? []).filter((t) => t !== time) }));
  };

  const handleContinue = () => {
    if (selectedList.length === 0) {
      setMessage('Select at least one day.');
      return;
    }
    const missing = selectedList.filter((day) => !availability[day]?.length);
    if (missing.length > 0) {
      setMessage(`Add a start time for ${missing.join(', ')}.`);
      return;
    }

    // TODO: save the availability to the backend, then continue to meeting details
    navigate(NEXT_ROUTE, {
      state: {
        skill,
        duration,
        availability: Object.fromEntries(selectedList.map((day) => [day, availability[day]])),
      },
    });
  };

  return (
    <>
      <NavBar points={currentUser.points} initials={getInitials(currentUser.name)} />

      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Make it work for you</p>
            <h1 className={styles.title}>When can you teach?</h1>
            <p className={styles.subtitle}>
              Choose your days, then add the times you’re available. You can update these later.
            </p>
          </header>

          <div className={styles.layout}>
            <section className={`${styles.card} ${styles.mainCard}`}>
              <h2 className={styles.cardTitle}>Session duration</h2>
              <div className={styles.durationGroup} role="group" aria-label="Session duration">
                {DURATIONS.map((minutes) => {
                  const isActive = duration === minutes;
                  return (
                    <button
                      key={minutes}
                      type="button"
                      aria-pressed={isActive}
                      className={`${styles.pill}${isActive ? ` ${styles.active}` : ''}`}
                      onClick={() => setDuration(minutes)}
                    >
                      {minutes} minutes
                    </button>
                  );
                })}
              </div>

              <div className={styles.pointsRow}>
                <span className={styles.pointsLabel}>Skill points</span>
                <button
                  type="button"
                  className={styles.helpButton}
                  aria-label="How skill points work"
                  aria-expanded={showPointsHelp}
                  aria-controls="points-help"
                  onClick={() => setShowPointsHelp((open) => !open)}
                >
                  ?
                </button>
              </div>
              {showPointsHelp && (
                <p className={styles.helpText} id="points-help">
                  Learners spend skill points to book you. You earn {POINTS_PER_HOUR} points for
                  every hour you teach, so shorter sessions earn fewer points.
                </p>
              )}
              <p className={styles.points}>{getPoints(duration)} points</p>

              <h2 className={`${styles.cardTitle} ${styles.daysTitle}`} id="days-heading">
                Available days
              </h2>
              <div className={styles.dayGroup} role="group" aria-labelledby="days-heading">
                {DAYS.map((day) => {
                  const isActive = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={isActive}
                      className={`${styles.pill} ${styles.dayPill}${
                        isActive ? ` ${styles.active}` : ''
                      }`}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className={styles.timesButton}
                aria-expanded={isEditingTimes}
                aria-controls="times-panel"
                onClick={toggleTimesEditor}
              >
                Add or edit times
              </button>

              {isEditingTimes && (
                <div className={styles.timesPanel} id="times-panel">
                  <label className={styles.timesLabel} htmlFor="start-time">
                    Start time for {selectedList.join(', ')}
                  </label>
                  <div className={styles.timesRow}>
                    <input
                      id="start-time"
                      className={styles.timeInput}
                      type="time"
                      value={newTime}
                      onChange={(event) => {
                        setNewTime(event.target.value);
                        setMessage('');
                      }}
                    />
                    <button type="button" className={styles.saveTimeButton} onClick={saveTime}>
                      Save time
                    </button>
                  </div>
                </div>
              )}

              <p
                className={`${styles.hint}${message ? ` ${styles.hintError}` : ''}`}
                role={message ? 'alert' : undefined}
              >
                {message || DEFAULT_HINT}
              </p>

              <button type="button" className={styles.continueButton} onClick={handleContinue}>
                Continue to meeting details
              </button>
            </section>

            <aside className={`${styles.card} ${styles.sideCard}`}>
              <h2 className={styles.sideTitle}>Your weekly availability</h2>
              <p className={styles.sideText}>Save a start time for your selected days.</p>

              <ul className={styles.weekList}>
                {DAYS.map((day) => {
                  const times = selectedDays.includes(day) ? availability[day] ?? [] : [];
                  return (
                    <li className={styles.weekRow} key={day}>
                      <span className={styles.weekDay}>{day}</span>
                      <span className={styles.weekTimes}>
                        {times.length === 0
                          ? '—'
                          : times.map((time) => (
                              <span className={styles.chip} key={time}>
                                {formatTime(time)}
                                <button
                                  type="button"
                                  className={styles.chipRemove}
                                  aria-label={`Remove ${formatTime(time)} on ${day}`}
                                  onClick={() => removeTime(day, time)}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}