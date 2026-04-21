import { Router } from "express";
import {
  getExpense,
  getExpenses,
  postExpense,
  putExpense,
  removeExpense,
} from "../controllers/expenseController.js";
import { ROLES } from "../constants/index.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  createExpenseSchema,
  expenseIdParamSchema,
  expenseQuerySchema,
  updateExpenseSchema,
} from "../validations/expenseValidation.js";

export const expenseRoutes = Router();

expenseRoutes.use(protect);
expenseRoutes.get("/", validate(expenseQuerySchema, "query"), getExpenses);
expenseRoutes.get("/:id", validate(expenseIdParamSchema, "params"), getExpense);
expenseRoutes.post(
  "/",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(createExpenseSchema),
  postExpense
);
expenseRoutes.put(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(expenseIdParamSchema, "params"),
  validate(updateExpenseSchema),
  putExpense
);
expenseRoutes.delete(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(expenseIdParamSchema, "params"),
  removeExpense
);

