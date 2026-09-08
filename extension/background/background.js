// Background Service Worker — core time tracking engine.
// Responsibilities:
//   1. Detect which tab/domain is currently active
//   2. Track active time while the browser is not idle
//   3. Buffer tracking data locally, then sync it to the backend
//   4. Detect browser startup/shutdown to close any open session
import { storage, STORAGE_KEYS } from "../utils/storage.js";
import { api } from "../utils/api.js";

const IDLE_THRESHOLD_SECONDS = 60; // user is "idle" after 60s of no input
const SYNC_INTERVAL_MINUTES = 1; // how often buffered data is flushed to the API

let currentSession = null; // { domain, tabId, startedAt } — in-memory for speed
let isIdle = false;

// Extracts a clean domain (e.g. "github.com") from any tab URL.
// Returns null for internal chrome:// pages, which we never track.
function getDomainFromUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith("http")) return null;
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

// Ends the current session (if any) and buffers its duration for syncing.
async function endCurrentSession() {
  if (!currentSession) return;

  const durationSeconds = Math.round(
    (Date.now() - currentSession.startedAt) / 1000,
  );
  if (durationSeconds > 0) {
    const { [STORAGE_KEYS.PENDING_SYNC]: pending = [] } = await storage.get(
      STORAGE_KEYS.PENDING_SYNC,
    );
    pending.push(...splitSessionByDate(currentSession));
    await storage.set({ [STORAGE_KEYS.PENDING_SYNC]: pending });
  }

  currentSession = null;
  await storage.remove(STORAGE_KEYS.ACTIVE_SESSION);
}

function splitSessionByDate(session) {
  const entries = [];
  let cursor = session.startedAt;
  const end = Date.now();

  while (cursor < end) {
    const nextMidnight = new Date(cursor);
    nextMidnight.setHours(24, 0, 0, 0);
    const segmentEnd = Math.min(nextMidnight.getTime(), end);
    const durationSeconds = Math.round((segmentEnd - cursor) / 1000);
    if (durationSeconds > 0) {
      entries.push({
        domain: session.domain,
        date: new Date(cursor).toISOString().slice(0, 10),
        durationSeconds,
      });
    }
    cursor = segmentEnd;
  }

  return entries;
}

// Starts a new session for the given domain/tab.
async function startSession(domain, tabId) {
  currentSession = { domain, tabId, startedAt: Date.now() };
  await storage.set({ [STORAGE_KEYS.ACTIVE_SESSION]: currentSession });
}

async function restoreSession() {
  const { [STORAGE_KEYS.ACTIVE_SESSION]: savedSession } = await storage.get(
    STORAGE_KEYS.ACTIVE_SESSION,
  );
  if (savedSession?.domain && savedSession?.startedAt) currentSession = savedSession;
}

async function startTrackingCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await handleActiveTabChange(tab);
}

// Called whenever the active tab or its URL changes.
async function handleActiveTabChange(tab) {
  await endCurrentSession();

  if (isIdle || !tab?.url) return;

  const domain = getDomainFromUrl(tab.url);
  if (domain) await startSession(domain, tab.id);
}

// --- Chrome event listeners ---

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  handleActiveTabChange(tab);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only react when the URL actually changes on the currently active tab.
  if (changeInfo.url && tab.active) handleActiveTabChange(tab);
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus entirely — pause tracking.
    await endCurrentSession();
    return;
  }
  const [tab] = await chrome.tabs.query({ active: true, windowId });
  handleActiveTabChange(tab);
});

// Idle detection — pauses tracking when the user is away from the keyboard.
chrome.idle.setDetectionInterval(IDLE_THRESHOLD_SECONDS);
chrome.idle.onStateChanged.addListener(async (state) => {
  if (state === "idle" || state === "locked") {
    isIdle = true;
    await endCurrentSession();
  } else if (state === "active") {
    isIdle = false;
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    handleActiveTabChange(tab);
  }
});

// Browser startup/shutdown.
chrome.runtime.onStartup.addListener(async () => {
  await restoreSession();
  await startTrackingCurrentTab();
  console.log("[FocusTrack] Browser started — tracking resumed.");
});

// chrome.runtime has no reliable "onShutdown", so we flush on suspend instead.
chrome.runtime.onSuspend.addListener(async () => {
  await endCurrentSession();
});

// --- Periodic sync to backend via chrome.alarms ---

chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create("focustrack-sync", {
    periodInMinutes: SYNC_INTERVAL_MINUTES,
  });
  console.log(
    "[FocusTrack] Background service worker installed. Sync alarm scheduled.",
  );
  await startTrackingCurrentTab();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "focustrack-sync") return;
  await flushPendingSync();
});

// Sends buffered tracking entries to the backend and clears the buffer
// only if the sync succeeds (so nothing is lost on network failure).
async function flushPendingSync() {
  const { [STORAGE_KEYS.PENDING_SYNC]: pending = [] } = await storage.get(
    STORAGE_KEYS.PENDING_SYNC,
  );
  if (pending.length === 0) return;

  try {
    await api.syncTracking(pending);
    await storage.set({ [STORAGE_KEYS.PENDING_SYNC]: [] });
  } catch (err) {
    console.warn(
      "[FocusTrack] Sync failed, will retry next interval:",
      err.message,
    );
  }
}

// --- Notifications (Module 12) ---
// Break reminder: nudges the user every 50 minutes of continuous active tracking.
// Goal completion and productivity reminders are pushed by polling the API
// summary once per sync interval and comparing against thresholds.

let continuousActiveSeconds = 0;
const BREAK_REMINDER_THRESHOLD_SECONDS = 50 * 60;

chrome.alarms.create("focustrack-break-check", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "focustrack-break-check") return;

  if (currentSession && !isIdle) {
    continuousActiveSeconds += 60;
    if (continuousActiveSeconds >= BREAK_REMINDER_THRESHOLD_SECONDS) {
      chrome.notifications.create(`break-${Date.now()}`, {
        type: "basic",
        iconUrl: "../icons/icon128.png",
        title: "Time for a break",
        message:
          "You've been active for 50 minutes. Consider stepping away for a few minutes.",
        priority: 1,
      });
      continuousActiveSeconds = 0;
    }
  } else {
    continuousActiveSeconds = 0;
  }
});

// Fired from the popup or backend sync when a goal is completed.
export async function notifyGoalComplete(goalTitle) {
  chrome.notifications.create(`goal-${Date.now()}`, {
    type: "basic",
    iconUrl: "../icons/icon128.png",
    title: "Goal completed! 🎉",
    message: `You hit your target for "${goalTitle}". Great work!`,
    priority: 1,
  });
}
