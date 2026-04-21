import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", protect, getDashboard);

