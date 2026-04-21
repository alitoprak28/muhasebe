import { Router } from "express";
import {
  getBankMovementReportById,
  getCashMovementReportById,
  getCurrentStatementReportById,
  getDailyIncome,
  getExpenseCategories,
  getMonthlyFinancials,
  getOverview,
} from "../controllers/reportController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { currentIdParamSchema } from "../validations/currentValidation.js";
import { accountIdParamSchema } from "../validations/accountValidation.js";
import { reportQuerySchema } from "../validations/reportValidation.js";

export const reportRoutes = Router();

reportRoutes.use(protect);
reportRoutes.get("/overview", validate(reportQuerySchema, "query"), getOverview);
reportRoutes.get("/income-daily", validate(reportQuerySchema, "query"), getDailyIncome);
reportRoutes.get(
  "/monthly-financials",
  validate(reportQuerySchema, "query"),
  getMonthlyFinancials
);
reportRoutes.get(
  "/expense-categories",
  validate(reportQuerySchema, "query"),
  getExpenseCategories
);
reportRoutes.get(
  "/currents/:id/statement",
  validate(currentIdParamSchema, "params"),
  validate(reportQuerySchema, "query"),
  getCurrentStatementReportById
);
reportRoutes.get(
  "/cash/:id/movements",
  validate(accountIdParamSchema, "params"),
  validate(reportQuerySchema, "query"),
  getCashMovementReportById
);
reportRoutes.get(
  "/banks/:id/movements",
  validate(accountIdParamSchema, "params"),
  validate(reportQuerySchema, "query"),
  getBankMovementReportById
);
