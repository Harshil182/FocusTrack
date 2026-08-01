import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for the FocusTrack dashboard.
// Dev server runs on port 5173 by default and proxies /api calls
// to the Express backend so we avoid CORS issues in development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
