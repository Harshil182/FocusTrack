import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { syncTracking, getTodaySummary, getTrackingByRange } from "../controllers/trackingController.js";

const router = Router();

router.use(protect); // every tracking route requires authentication

router.post("/sync", syncTracking);
router.get("/summary/today", getTodaySummary);
router.get("/", getTrackingByRange);

export default router;
