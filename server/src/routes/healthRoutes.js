import { Router } from "express";

const router = Router();

// Simple health check — used by deployment platforms & uptime monitors.
router.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "FocusTrack API is healthy", time: new Date().toISOString() });
});

export default router;
