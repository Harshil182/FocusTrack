// Minimal console-based logger. Swappable for winston/pino later
// without touching any calling code.
const timestamp = () => new Date().toISOString();

export const logger = {
  info: (...args) => console.log(`[INFO ${timestamp()}]`, ...args),
  warn: (...args) => console.warn(`[WARN ${timestamp()}]`, ...args),
  error: (...args) => console.error(`[ERROR ${timestamp()}]`, ...args),
};
