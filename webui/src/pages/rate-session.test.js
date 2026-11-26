import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RateSession from './rate-session';

const session = { session_id: '1', skill: 'Photography basics', partner: 'Alex', mode: 'in_person', duration_minutes: 60, start_time: '2026-10-20T18:00:00Z' };
let review;
let saveFails;
let loadFails;
const originalFetch = global.fetch;
function renderPage(entry = '/rate-session?sessionId=1') {
  return render(<MemoryRouter initialEntries={[entry]}><Routes>
    <Route path="/rate-session" element={<RateSession />} />
  </Routes></MemoryRouter>);
}
beforeEach(() => {
  localStorage.clear();
  review = null; saveFails = false; loadFails = false;
  global.fetch = jest.fn(async (url, options = {}) => {
    if (loadFails) return { ok: false, json: async () => ({ error: 'Please log in.' }) };
    if (url === '/api/rating-sessions') return { ok: true, json: async () => ({ sessions: [session] }) };
    if (url === '/api/rating-sessions/1') return { ok: true, json: async () => ({ session }) };
    if (options.method === 'PUT') {
      if (saveFails) return { ok: false, json: async () => ({ error: 'Please log in again.' }) };
      review = { ...JSON.parse(options.body), status: 'visible' };
    }
    return { ok: true, json: async () => ({ review }) };
  });
});
afterEach(() => { global.fetch = originalFetch; });

test('requires stars and saves against the real session ID with authentication cookie', async () => {
  renderPage();
  fireEvent.click(await screen.findByRole('button', { name: 'Submit rating' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Please choose a rating');
  fireEvent.click(screen.getByRole('radio', { name: '4 stars — Very good' }));
  fireEvent.click(screen.getByRole('button', { name: 'Submit rating' }));
  expect(screen.getByRole('button', { name: 'Saving your rating…' })).toBeDisabled();
  expect(await screen.findByRole('heading', { name: 'Thanks for sharing.' })).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('/api/sessions/1/rating', expect.objectContaining({
    method: 'PUT', credentials: 'same-origin', headers: expect.objectContaining({ 'X-SkillTrade-Request': '1' }),
    body: JSON.stringify({ rating: 4, comment: '' }),
  }));
  expect(localStorage.length).toBe(0);
  expect(screen.getByText('Your rating is saved to your account.')).toBeInTheDocument();
});

test('reloads from the server and edits the same session review', async () => {
  review = { rating: 3, comment: 'Helpful examples', status: 'visible' };
  const page = renderPage();
  await screen.findByRole('heading', { name: 'Thanks for sharing.' });
  fireEvent.click(screen.getByRole('button', { name: 'Edit your rating' }));
  expect(screen.getByRole('textbox')).toHaveValue('Helpful examples');
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '  Clear explanations  ' } });
  fireEvent.click(screen.getByRole('radio', { name: '5 stars — Excellent' }));
  fireEvent.click(screen.getByRole('button', { name: 'Submit rating' }));
  await screen.findByRole('heading', { name: 'Thanks for sharing.' });
  page.unmount(); renderPage();
  expect(await screen.findByText(/Alex 5 out of 5/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Edit your rating' }));
  expect(screen.getByRole('textbox')).toHaveValue('Clear explanations');
});

test('failed saves keep the draft and never show success or write local storage', async () => {
  saveFails = true;
  renderPage();
  fireEvent.click(await screen.findByRole('radio', { name: '2 stars — Fair' }));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'More practice time' } });
  fireEvent.click(screen.getByRole('button', { name: 'Submit rating' }));
  await screen.findByText(/Please log in again/);
  expect(screen.getByRole('textbox')).toHaveValue('More practice time');
  expect(screen.queryByText('Thanks for sharing.')).not.toBeInTheDocument();
  expect(localStorage.length).toBe(0);
  saveFails = false;
  fireEvent.click(screen.getByRole('button', { name: 'Submit rating' }));
  await screen.findByRole('heading', { name: 'Thanks for sharing.' });
});

test('without an ID, chooses an authenticated completed session instead of guessing from listing ID', async () => {
  renderPage({ pathname: '/rate-session', state: { session: { ratingId: 99, skill: 'Unrelated demo' } } });
  fireEvent.click(await screen.findByRole('button', { name: /Photography basics with Alex/ }));
  await screen.findByRole('button', { name: 'Submit rating' });
  expect(fetch).toHaveBeenCalledWith('/api/rating-sessions/1', expect.anything());
  expect(fetch).not.toHaveBeenCalledWith('/api/rating-sessions/99', expect.anything());
});

test('accepts an explicit database session_id from navigation state', async () => {
  renderPage({ pathname: '/rate-session', state: { session: { session_id: '1' } } });
  await screen.findByRole('button', { name: 'Submit rating' });
  expect(fetch).toHaveBeenCalledWith('/api/rating-sessions/1', expect.anything());
});

test.each(['ses_001', '9223372036854775808'])('invalid ID %s never triggers a database rating request', async id => {
  renderPage(`/rate-session?sessionId=${id}`);
  expect(await screen.findByRole('alert')).toHaveTextContent('database session ID');
  expect(fetch).not.toHaveBeenCalled();
});

test('load failures block the form and offer login and retry', async () => {
  loadFails = true;
  renderPage();
  expect(await screen.findByRole('alert')).toHaveTextContent('Please log in.');
  expect(screen.queryByRole('button', { name: 'Submit rating' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
  loadFails = false;
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  await screen.findByRole('button', { name: 'Submit rating' });
});

test('no completed sessions shows an empty state without a rating form', async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => ({ sessions: [] }) });
  renderPage('/rate-session');
  expect(await screen.findByText('No completed sessions are available to rate yet.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Submit rating' })).not.toBeInTheDocument();
});

test('moderator-hidden ratings cannot be edited', async () => {
  review = { rating: 3, comment: '', status: 'hidden' };
  renderPage();
  expect(await screen.findByRole('button', { name: 'Edit your rating' })).toBeDisabled();
});
