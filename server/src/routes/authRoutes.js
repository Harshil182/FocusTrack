import { Router } from "express";
import { register, login, logout, getProfile, updateProfile } from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validators/authValidators.js";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, registerValidator, validate, register);
router.post("/login", authLimiter, loginValidator, validate, login);
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
