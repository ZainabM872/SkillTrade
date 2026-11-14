import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import styles from '../styles/booking.module.css';

export default function Explore() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function loadSkills() {
      try {
        const response = await fetch('/api/listings', { signal: controller.signal });
        if (!response.ok) throw new Error('Could not load skills.');
        setListings(await response.json());
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Could not load skills. Please refresh and try again.');
          setLoading(false);
        }
      }
    }
    loadSkills();
    return () => controller.abort();
  }, []);

  return (
    <div className={styles.mainContainer} style={{ height: 'auto', minHeight: '100vh', overflow: 'visible' }}>
      <NavBar points={120} initials="SM" />
      <div className={styles.headerDivider} />
      <span className={styles.sectionEyebrow}>LEARN SOMETHING NEW</span>
      <h1 className={styles.pageTitle}>Explore skills</h1>
      <p className={styles.pageDescription}>Find a skill and choose a session.</p>
      {loading && <p role="status">Loading skills...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && !listings.length && <p>No active skills are available yet.</p>}
      <div className={styles.contentRow} style={{ flexWrap: 'wrap', height: 'auto', gap: 24, alignItems: 'flex-start', justifyContent: 'flex-start', paddingBottom: 40 }}>
        {listings.map((listing) => (
          <article key={listing.listing_id} className={styles.summaryCard} style={{ height: 'auto', fontSize: 16, paddingBottom: 32 }}>
            <h2 className={styles.skillName}>{listing.title}</h2>
            <span className={styles.instructorName}>{listing.teacher_name}</span>
            <p style={{ margin: '20px 32px' }}>{listing.description}</p>
            <p style={{ margin: '20px 32px' }}>{listing.session_mode === 'online' ? 'Online' : listing.session_mode === 'in_person' ? 'In person' : 'Online or in person'}</p>
            <p className={styles.sessionDetails}>{listing.duration_minutes} minutes · {listing.point_cost} points</p>
            <div className={styles.requestAction}><Link className={styles.requestButton} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }} to={`/booking?listing=${listing.listing_id}`} aria-label={`Book ${listing.title}`}>Book</Link></div>
          </article>
        ))}
      </div>
    </div>
  );
}
