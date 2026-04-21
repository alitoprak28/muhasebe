import { Router } from "express";
import {
  getIncome,
  getIncomes,
  postIncome,
  putIncome,
  removeIncome,
} from "../controllers/incomeController.js";
import { ROLES } from "../constants/index.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  createIncomeSchema,
  incomeIdParamSchema,
  incomeQuerySchema,
  updateIncomeSchema,
} from "../validations/incomeValidation.js";

export const incomeRoutes = Router();

incomeRoutes.use(protect);
incomeRoutes.get("/", validate(incomeQuerySchema, "query"), getIncomes);
incomeRoutes.get("/:id", validate(incomeIdParamSchema, "params"), getIncome);
incomeRoutes.post(
  "/",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(createIncomeSchema),
  postIncome
);
incomeRoutes.put(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(incomeIdParamSchema, "params"),
  validate(updateIncomeSchema),
  putIncome
);
incomeRoutes.delete(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(incomeIdParamSchema, "params"),
  removeIncome
);

