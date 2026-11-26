import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginForm } from './intro';

function openForm() {
  render(<MemoryRouter><Routes><Route path="/" element={<LoginForm />} /><Route path="/homepage" element={<h1>Home</h1>} /></Routes></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'sam@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'my-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
}

afterEach(() => { jest.restoreAllMocks(); });

test('successful login sends credentials to the API before navigating', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ user: { userId: '2' } }) });
  openForm();
  expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
    method: 'POST', credentials: 'same-origin',
    headers: expect.objectContaining({ 'X-SkillTrade-Request': '1' }),
    body: JSON.stringify({ email: 'sam@example.com', password: 'my-password' }),
  }));
});

test('wrong password stays on login and shows the server error', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: 'Email or password is incorrect.' }) });
  openForm();
  expect(await screen.findByRole('alert')).toHaveTextContent('Email or password is incorrect.');
  expect(screen.queryByRole('heading', { name: 'Home' })).not.toBeInTheDocument();
  expect(screen.getByLabelText('Email address')).toHaveValue('sam@example.com');
  expect(screen.getByRole('button', { name: 'Log in' })).toBeEnabled();
});

test('network failure shows a retry message instead of pretending to log in', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
  openForm();
  expect(await screen.findByRole('alert')).toHaveTextContent('Couldn’t reach the login service');
  expect(screen.getByRole('button', { name: 'Log in' })).toBeEnabled();
});
