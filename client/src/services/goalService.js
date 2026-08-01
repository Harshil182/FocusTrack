import api from "./api.js";

export const goalService = {
  getGoals: () => api.get("/goals").then((r) => r.data),
  createGoal: (payload) => api.post("/goals", payload).then((r) => r.data),
  updateGoal: (id, payload) => api.put(`/goals/${id}`, payload).then((r) => r.data),
  deleteGoal: (id) => api.delete(`/goals/${id}`).then((r) => r.data),
};
