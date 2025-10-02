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
