// Formats a duration in seconds as "Xh Ym" — used throughout the dashboard.
export function formatDuration(seconds = 0) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

// Computes a 0-100 productivity score from productive vs total seconds.
export function productivityScore(productiveSeconds, totalSeconds) {
  if (!totalSeconds) return 0;
  return Math.round((productiveSeconds / totalSeconds) * 100);
}
