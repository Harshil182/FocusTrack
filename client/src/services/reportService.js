import api from "./api.js";

export const reportService = {
  getHistory: () => api.get("/reports").then((r) => r.data),
  exportReport: (payload) =>
    api.post("/reports/export", payload, { responseType: "blob" }).then((r) => r.data),
};
