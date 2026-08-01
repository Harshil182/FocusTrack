// Content Script — runs on every page.
// Its only job is to notify the background worker about real user
// activity (mouse/keyboard/scroll) so idle detection is more accurate
// than relying on chrome.idle alone (which is based on system-level input).

let lastActivityPing = 0;
const PING_THROTTLE_MS = 5000; // avoid flooding messages on every mousemove

function reportActivity() {
  const now = Date.now();
  if (now - lastActivityPing < PING_THROTTLE_MS) return;
  lastActivityPing = now;

  chrome.runtime.sendMessage({ type: "USER_ACTIVITY", url: window.location.href }).catch(() => {
    // Extension context may be invalidated on reload — safe to ignore.
  });
}

["mousemove", "keydown", "scroll", "click"].forEach((evt) =>
  window.addEventListener(evt, reportActivity, { passive: true })
);
