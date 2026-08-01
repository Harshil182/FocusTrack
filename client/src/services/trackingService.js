import api from "./api.js";

export const trackingService = {
  getTodaySummary: () => api.get("/tracking/summary/today").then((r) => r.data),
  getByRange: (start, end) => api.get("/tracking", { params: { start, end } }).then((r) => r.data),
};
