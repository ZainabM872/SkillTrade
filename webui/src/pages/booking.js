import React, { useState } from "react";
import styles from "../styles/booking.module.css";
import NavBar from '../components/NavBar';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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

export default function Booking() {
  // Which month the calendar is currently showing
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
            <span className={styles.currentDate}>Selected · {selectedLabel}</span>
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
              const isPast = new Date(view.year, view.month, day) < startOfToday;
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
          <span className={styles.skillName}>Acoustic guitar</span>
          <span className={styles.instructorName}>Alex Morgan</span>

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
            <span className={styles.summaryValue}>Community centre lobby</span>
          </div>

          <span className={styles.sessionDetails}>60 minutes · 15 points</span>
          <div className={styles.requestAction}>
            <span className={styles.requestButton}>Request session</span>
          </div>
          <span className={styles.backLink}>← Back to skill details</span>
        </div>
      </div>
      <span className={styles.bookingNotice}>
        Booked times include sessions you’re learning or teaching. Pending
        requests also reserve your time.
      </span>
    </div>
  );
}