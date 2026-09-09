import axios from "axios";

// Central Axios instance — every API call in the app goes through this
// so base URL, auth header, and error handling live in one place.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://focustrack-934s.onrender.com/api",
  withCredentials: true,
});

// Attach the JWT (from localStorage) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("focustrack_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 (expired/invalid token).
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("focustrack_token");
      localStorage.removeItem("focustrack_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
