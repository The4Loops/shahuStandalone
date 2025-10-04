// src/api/subscribe.js
export const API_BASE =
  process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export async function subscribeToInvite(email, name = '') {
  const res = await fetch(`${API_BASE}/api/public/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });

  let data = {};
  try { data = await res.json(); } catch (_) {}

  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data; // { ok: true, mailId: '...' }
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/public/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Email: email, Password: password }),
  });

  let data = {};
  try { data = await res.json(); } catch (_) {}

  if (!res.ok || data?.error) {
    throw new Error(data?.error || `Login failed (${res.status})`);
  }
  return data; // { message: 'Login successful', token: '...' }
}

export async function getInviteRequests(token) {
  const res = await fetch(`${API_BASE}/api/public/invite`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  let data = {};
  try { data = await res.json(); } catch (_) {}

  if (!res.ok || data?.error) {
    throw new Error(data?.error || `Failed to fetch invite requests (${res.status})`);
  }
  return data; // { inviteRequests: [...] }
}