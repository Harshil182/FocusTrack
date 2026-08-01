// Thin wrapper around chrome.storage.local so the rest of the extension
// never touches the raw callback-based API directly.
export const storage = {
  get: (keys) =>
    new Promise((resolve) => chrome.storage.local.get(keys, resolve)),
  set: (obj) =>
    new Promise((resolve) => chrome.storage.local.set(obj, resolve)),
  remove: (keys) =>
    new Promise((resolve) => chrome.storage.local.remove(keys, resolve)),
};

// Keys used across the extension — centralized to avoid typos.
export const STORAGE_KEYS = {
  TOKEN: "focustrack_token",
  USER: "focustrack_user",
  ACTIVE_SESSION: "focustrack_active_session", // { domain, tabId, startedAt }
  PENDING_SYNC: "focustrack_pending_sync", // buffered tracking entries not yet sent to the API
};
