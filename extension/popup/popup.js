import { storage, STORAGE_KEYS } from "../utils/storage.js";
import { api } from "../utils/api.js";

const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginError = document.getElementById("loginError");

// Formats seconds as "Xh Ym" for display.
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

async function renderDashboard() {
  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");

  try {
    const { summary } = await api.getTodaySummary();
    document.getElementById("totalTime").textContent = formatDuration(summary?.totalSeconds || 0);
    document.getElementById("productiveTime").textContent = formatDuration(summary?.productiveSeconds || 0);
  } catch (err) {
    console.warn("[FocusTrack] Could not load today's summary:", err.message);
  }
}

async function init() {
  const { [STORAGE_KEYS.TOKEN]: token } = await storage.get(STORAGE_KEYS.TOKEN);
  if (token) {
    renderDashboard();
  } else {
    loginView.classList.remove("hidden");
    dashboardView.classList.add("hidden");
  }
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  loginError.textContent = "";

  try {
    const { user, token } = await api.login(email, password);
    await storage.set({ [STORAGE_KEYS.TOKEN]: token, [STORAGE_KEYS.USER]: user });
    renderDashboard();
  } catch (err) {
    loginError.textContent = err.message;
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await storage.remove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
  init();
});

init();
