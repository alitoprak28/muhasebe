import { Router } from "express";
import {
  getCashAccountMovements,
  getCashAccounts,
  postCashAccount,
  putCashAccount,
} from "../controllers/accountController.js";
import { ROLES } from "../constants/index.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  accountIdParamSchema,
  accountQuerySchema,
  createCashAccountSchema,
  updateCashAccountSchema,
} from "../validations/accountValidation.js";

export const cashRoutes = Router();

cashRoutes.use(protect);
cashRoutes.get("/accounts", validate(accountQuerySchema, "query"), getCashAccounts);
cashRoutes.get(
  "/accounts/:id/movements",
  validate(accountIdParamSchema, "params"),
  getCashAccountMovements
);
cashRoutes.post(
  "/accounts",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(createCashAccountSchema),
  postCashAccount
);
cashRoutes.put(
  "/accounts/:id",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(accountIdParamSchema, "params"),
  validate(updateCashAccountSchema),
  putCashAccount
);

