import React, { useState } from "react";
import styles from "../styles/booking.module.css";
 
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dates = Array.from({ length: 30 }, (_, index) => index + 1);
const defaultTimes = [
  { label: "10:00 AM", available: true },
  { label: "11:00 AM", available: false },
  { label: "1:00 PM", available: true },
  { label: "2:00 PM", available: true },
  { label: "4:00 PM", available: true },
  { label: "6:00 PM", available: true },
];
 
export default function Booking() {
  const [selectedDate, setSelectedDate] = useState(15);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
 
  const selectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime("10:00 AM");
  };
 
  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerRow}>
        <div className={styles.pointsFaq}>
          <div className={styles.sparkleIcon} />
          <span className={styles.pointsBalance}>120 points</span>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.notificationButton}>
            <div className={styles.bellIcon} />
          </div>
          <div className={styles.profileButton}>
            <span className={styles.profileInitials}>SM</span>
          </div>
        </div>
        <span className={`${styles.navItem} ${styles.navHome}`}>Home</span>
        <span className={`${styles.navItem} ${styles.navExplore}`}>Explore</span>
        <span className={`${styles.navItem} ${styles.navSessions}`}>Sessions</span>
        <span className={`${styles.navItem} ${styles.navTeach}`}>Teach a skill</span>
      </div>
      <div className={styles.activeNav} />
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
            <span className={styles.currentDate}>
              Selected · November {selectedDate}, 2026
            </span>
            <span className={styles.calendarMonth}>November 2026</span>
          </div>
          <div className={styles.calendarControls}>
            {weekdays.map((weekday) => (
              <span className={styles.calendarWeekday} key={weekday}>
                {weekday}
              </span>
            ))}
          </div>
          <div className={styles.dateGrid} aria-label="November 2026 dates">
            {dates.map((date) => {
              const isPast = date < 15;
              const isSelected = date === selectedDate;
 
              return (
                <button
                  className={`${styles.dateButton} ${
                    isSelected ? styles.isSelected : ""
                  }`}
                  type="button"
                  key={date}
                  disabled={isPast}
                  aria-label={`November ${date}, 2026`}
                  aria-pressed={isSelected}
                  onClick={() => selectDate(date)}
                >
                  {date}
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
            <span className={styles.summaryValue}>
              November {selectedDate}, 2026
            </span>
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