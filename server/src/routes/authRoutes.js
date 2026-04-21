import { Router } from "express";
import { getMe, login } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { loginSchema } from "../validations/authValidation.js";

export const authRoutes = Router();

authRoutes.post("/login", validate(loginSchema), login);
authRoutes.get("/me", protect, getMe);

