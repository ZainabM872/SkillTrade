import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "../styles/booking.module.css";
import NavBar from "../components/NavBar";
import PopupStyles from "../styles/cancel_reschedule.module.css";
import Sparkle from "../styles/icons/Sparkle.svg";
import Cancel from "../styles/icons/Cancel_Button.svg";

const SESSIONS_ROUTE = "/sessions";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const defaultTimes = [
  { label: "10:00 AM", available: true },
  { label: "11:00 AM", available: false },
  { label: "1:00 PM", available: true },
  { label: "2:00 PM", available: true },
  { label: "4:00 PM", available: true },
  { label: "6:00 PM", available: true },
];

const now = new Date();
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

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

export default function Booking() {
  const [listings, setListings] = useState([]);
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listing');
  const [loading, setLoading] = useState(true);
  const [listingError, setListingError] = useState('');

  useEffect(() => {
    if (!listingId) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setListingError('');
    setListings([]);

    async function loadListings() {
      try {
        const response = await fetch('/api/listings', {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('Could not load listings.');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid listings response.");
        setListings(data);
        setLoading(false);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setListingError('Could not load skills. Please refresh and try again.');
          setLoading(false);
        }
      }
    }

    loadListings();
    return () => controller.abort();
  }, [listingId]);

  const listing = listings.find((item) => String(item.listing_id) === listingId);

  const [openModal, setOpenModal] = useState(null);
  const [cancelError, setCancelError] = useState("");
  // Which month the calendar is currently showing
  const navigate = useNavigate();
  const [view, setView] = useState({
    year: startOfToday.getFullYear(),
    month: startOfToday.getMonth(),
  });
  // The date the user picked (can be in a different month than the one shown)
  const [selected, setSelected] = useState({
    year: startOfToday.getFullYear(),
    month: startOfToday.getMonth(),
    day: startOfToday.getDate(),
  });
  const [selectedTime, setSelectedTime] = useState("10:00 AM");

  const viewLabel = `${monthNames[view.month]} ${view.year}`;
  const selectedLabel = `${monthNames[selected.month]} ${selected.day}, ${selected.year}`;

  // Build the grid for the month being viewed
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const blanks = (new Date(view.year, view.month, 1).getDay() + 6) % 7;
  const dates = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  // Don't allow browsing to months that were in the past
  const canGoBack = new Date(view.year, view.month, 1) > startOfThisMonth;

  const changeMonth = (delta) => {
    setView(({ year, month }) => {
      const next = new Date(year, month + delta, 1); // handles Dec -> Jan rollover
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const selectDate = (day) => {
    setSelected({ year: view.year, month: view.month, day });
    setSelectedTime("10:00 AM");
  };

  const closeModal = () => {
    setOpenModal(null);
    setCancelError("");
  };

  return (
    <div className={styles.mainContainer}>
      <NavBar points={120} initials="SM" />
      <div className={styles.headerDivider} />
      <span className={styles.sectionEyebrow}>LEARN SOMETHING NEW</span>
      <span className={styles.pageTitle}>Book your session</span>
      <span className={styles.pageDescription}>
        Choose a date and an available time. You’ll review the meeting details
        before sending.
      </span>
      <div className={styles.contentRow}>
        <div className={styles.bookingCard}>
          <div className={styles.calendarHeader}>
            <div className={styles.monthNav}>
              <span className={styles.calendarMonth}>{viewLabel}</span>
              <button
                className={styles.monthArrow}
                type="button"
                aria-label="Previous month"
                disabled={!canGoBack}
                onClick={() => changeMonth(-1)}
              >
                ‹
              </button>
              <button
                className={styles.monthArrow}
                type="button"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
              >
                ›
              </button>
            </div>
            <span className={styles.currentDate}>
              Selected · {selectedLabel}
            </span>
          </div>
          <div className={styles.calendarControls}>
            {weekdays.map((weekday) => (
              <span className={styles.calendarWeekday} key={weekday}>
                {weekday}
              </span>
            ))}
          </div>
          <div className={styles.dateGrid} aria-label={`${viewLabel} dates`}>
            {Array.from({ length: blanks }, (_, i) => (
              <span key={`blank-${i}`} aria-hidden="true" />
            ))}
            {dates.map((day) => {
              const isPast =
                new Date(view.year, view.month, day) < startOfToday;
              const isSelected =
                day === selected.day &&
                view.month === selected.month &&
                view.year === selected.year;

              return (
                <button
                  className={`${styles.dateButton} ${
                    isSelected ? styles.isSelected : ""
                  }`}
                  type="button"
                  key={day}
                  disabled={isPast}
                  aria-label={`${monthNames[view.month]} ${day}, ${view.year}`}
                  aria-pressed={isSelected}
                  onClick={() => selectDate(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <span className={styles.availableTimes}>Available times</span>
          <div className={styles.timeGrid} aria-label="Available session times">
            {defaultTimes.map((time) => {
              const isSelected = time.label === selectedTime;

              return (
                <button
                  className={`${styles.timeButton} ${
                    isSelected ? styles.isSelected : ""
                  }`}
                  type="button"
                  key={time.label}
                  disabled={!time.available}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedTime(time.label)}
                >
                  {time.label}
                  {!time.available && " · Booked"}
                </button>
              );
            })}
          </div>
        </div>
        <div className={styles.summaryCard}>
          {loading && <p role="status" style={{ fontSize: 14, margin: 32 }}>Loading skill...</p>}
          {listingError && <p role="alert" style={{ fontSize: 14, margin: 32 }}>{listingError}</p>}
          {!loading && !listingError && !listing && (
            <p style={{ fontSize: 14, margin: 32 }}>{listingId ? 'This skill is no longer available.' : 'Choose a skill from Explore to book a session.'} <Link to="/explore">Explore skills</Link></p>
          )}
          <span className={styles.skillName}>{listing?.title}</span>
          <span className={styles.instructorName}>{listing?.teacher_name}</span>

          <span className={`${styles.summaryLabel} ${styles.firstLabel}`}>
            Selected date
          </span>
          <div className={styles.summaryField}>
            <span className={styles.summaryValue}>{selectedLabel}</span>
          </div>

          <span className={styles.summaryLabel}>Selected time</span>
          <div className={styles.summaryField}>
            <span className={styles.summaryValue}>{selectedTime}</span>
          </div>

          <span className={styles.summaryLabel}>Meeting location</span>
          <div className={styles.summaryField}>
            <span className={styles.summaryValue}>{listing?.session_mode === 'online' ? 'Online' : 'Choose a location later'}</span>
          </div>

          <span className={styles.sessionDetails}>{listing && `${listing.duration_minutes} minutes · ${listing.point_cost} points`}</span>
          <div className={styles.requestAction}>
            <button
              type="button"
              className={styles.requestButton}
              disabled={!listing || loading || !!listingError}
              onClick={() => setOpenModal("request")}
            >
              Request session
            </button>
          </div>
          {listing && !loading && !listingError && listing.session_mode !== 'online' && (
            <Link className={styles.backLink} to="/meeting-location" state={{ booking: { ...listing, date: selectedLabel, time: selectedTime } }}>
              Choose meeting location
            </Link>
          )}
          <Link className={styles.backLink} to="/explore">← Back to Explore</Link>
        </div>

        {openModal === "request" && (
          <Modal
            title="You’re one step closer"
            description="This is a booking preview. Your request has not been saved."
            actionLabel="View Sessions"
            onAction={() => navigate(SESSIONS_ROUTE)}
            onClose={closeModal}
            error={cancelError}
          />
        )}
      </div>
      <span className={styles.bookingNotice}>
        Skill details come from the database. Dates and times are examples.
        Booking requests are not saved yet.
      </span>
    </div>
  );
}
