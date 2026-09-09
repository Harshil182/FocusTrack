import { storage, STORAGE_KEYS } from "./storage.js";

// Base URL of the backend. In production this would point at the
// deployed API (set in Module 14 — Deployment).
const API_BASE_URL = "https://focustrack-934s.onrender.com/api";

async function request(path, options = {}) {
  const { [STORAGE_KEYS.TOKEN]: token } = await storage.get(STORAGE_KEYS.TOKEN);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  syncTracking: (entries) =>
    request("/tracking/sync", { method: "POST", body: JSON.stringify({ entries }) }),
  getTodaySummary: () => request("/tracking/summary/today"),
};
