import { Router } from "express";
import { authRoutes } from "./authRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { incomeRoutes } from "./incomeRoutes.js";
import { expenseRoutes } from "./expenseRoutes.js";
import { currentRoutes } from "./currentRoutes.js";
import { cashRoutes } from "./cashRoutes.js";
import { bankRoutes } from "./bankRoutes.js";
import { invoiceRoutes } from "./invoiceRoutes.js";
import { dashboardRoutes } from "./dashboardRoutes.js";
import { reportRoutes } from "./reportRoutes.js";
import { transactionRoutes } from "./transactionRoutes.js";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/incomes", incomeRoutes);
router.use("/expenses", expenseRoutes);
router.use("/currents", currentRoutes);
router.use("/cash", cashRoutes);
router.use("/banks", bankRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/transactions", transactionRoutes);
router.use("/reports", reportRoutes);
