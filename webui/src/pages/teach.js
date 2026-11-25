
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/teach.module.css';
import NavBar from '../components/NavBar';

// Temporary data (replace with backend response)
const MOCK_CURRENT_USER = { id: 'usr_001', name: 'Sara Moon', points: 120 };

const CATEGORIES = [
  { value: 'music', label: 'Music' },
  { value: 'sports', label: 'Sports & movement' },
  { value: 'food', label: 'Food & drink' },
  { value: 'art', label: 'Art' },
  { value: 'languages', label: 'Languages' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const SESSION_FORMATS = [
  { value: 'in-person', label: 'In person' },
  { value: 'online', label: 'Online' },
  { value: 'both', label: 'Both' },
];

const POINTS_PER_HOUR = 15;

const NEXT_ROUTE = '/teach/availability';

const INITIAL_FORM = {
  title: '',
  category: 'other',
  difficulty: 'beginner',
  description: '',
  format: 'in-person',
};

// "Sara Moon" -> "SM"
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Add a title for your skill.';
  if (!form.category) errors.category = 'Choose a category.';
  if (!form.difficulty) errors.difficulty = 'Choose a difficulty.';
  if (!form.description.trim()) errors.description = 'Add a short description.';
  return errors;
}

function SparkleIcon() {
  return (
    <svg
      className={styles.sparkle}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    </svg>
  );
}

// Label + control + error message
function Field({ id, label, error, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <p className={styles.error} id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Page ---------- */

export default function Teach({ currentUser = MOCK_CURRENT_USER }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the existing skill if the user came here by clicking Edit
  const existingSkill = location.state?.skill;

  // Use the existing information when editing.
  // Otherwise, start with the default empty form.
  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    ...(existingSkill ?? {}),
  }));

  const [errors, setErrors] = useState({});

  const update = (name) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear a field's error as soon as the user edits it
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Continue to availability while preserving the skill information
    navigate(NEXT_ROUTE, {
      state: {
        skill: {
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
        },
      },
    });
  };

  // Props to connect a control with its error message for screen readers
  const a11y = (name, id) => ({
    id,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${id}-error` : undefined,
  });

  return (
    <>
      <NavBar points={currentUser.points} initials={getInitials(currentUser.name)} />

      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Share what you know</p>
            <h1 className={styles.title}>Teach a new skill</h1>
            <p className={styles.subtitle}>
              Your everyday knowledge could open a door for someone else.
            </p>
          </header>

          <div className={styles.layout}>
            <form className={`${styles.card} ${styles.formCard}`} onSubmit={handleSubmit} noValidate>
              <h2 className={styles.cardTitle}>Tell us about your skill</h2>

              <Field id="skill-title" label="Skill title" error={errors.title}>
                <input
                  {...a11y('title', 'skill-title')}
                  className={styles.control}
                  type="text"
                  value={form.title}
                  onChange={update('title')}
                />
              </Field>

              <div className={styles.row}>
                <Field id="skill-category" label="Category" error={errors.category}>
                  <select
                    {...a11y('category', 'skill-category')}
                    className={`${styles.control} ${styles.select}`}
                    value={form.category}
                    onChange={update('category')}
                  >
                    <option value="" disabled>
                      Choose a category
                    </option>
                    {CATEGORIES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="skill-difficulty" label="Difficulty" error={errors.difficulty}>
                  <select
                    {...a11y('difficulty', 'skill-difficulty')}
                    className={`${styles.control} ${styles.select}`}
                    value={form.difficulty}
                    onChange={update('difficulty')}
                  >
                    <option value="" disabled>
                      Choose a difficulty
                    </option>
                    {DIFFICULTIES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field id="skill-description" label="Description" error={errors.description}>
                <textarea
                  {...a11y('description', 'skill-description')}
                  className={`${styles.control} ${styles.textarea}`}
                  rows={1}
                  value={form.description}
                  onChange={update('description')}
                />
              </Field>

              <h2 className={`${styles.cardTitle} ${styles.formatTitle}`} id="format-heading">
                Session format
              </h2>

              <div className={styles.formatGroup} role="group" aria-labelledby="format-heading">
                {SESSION_FORMATS.map(({ value, label }) => {
                  const isActive = form.format === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={isActive}
                      className={`${styles.pill}${isActive ? ` ${styles.active}` : ''}`}
                      onClick={() => setForm((prev) => ({ ...prev, format: value }))}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <button type="submit" className={styles.submitButton}>
                Continue to availability
              </button>
            </form>

            <aside className={`${styles.card} ${styles.tipCard}`}>
              <h2 className={styles.tipTitle}>A little encouragement</h2>
              <p className={styles.tipText}>
                You don’t have to know everything. Start with a skill you enjoy and a clear plan
                for what someone will learn.
              </p>

              <p className={styles.highlight}>
                <SparkleIcon />
                <span>Earn {POINTS_PER_HOUR} points for every hour you teach.</span>
              </p>

              <a className={styles.textLink} href="/teaching-tips">
                Read teaching tips ↗
              </a>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
