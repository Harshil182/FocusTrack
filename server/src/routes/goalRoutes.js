import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createGoal, getGoals, updateGoal, deleteGoal } from "../controllers/goalController.js";

const router = Router();
router.use(protect);

router.post("/", createGoal);
router.get("/", getGoals);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
