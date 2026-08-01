import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCategories, updateCategory } from "../controllers/categoryController.js";

const router = Router();
router.use(protect);

router.get("/", getCategories);
router.put("/:id", updateCategory);

export default router;
