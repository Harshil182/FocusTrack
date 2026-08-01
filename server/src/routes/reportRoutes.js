import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getReportHistory, exportReport } from "../controllers/reportController.js";

const router = Router();
router.use(protect);

router.get("/", getReportHistory);
router.post("/export", exportReport);

export default router;
