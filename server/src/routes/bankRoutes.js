import { Router } from "express";
import {
  getBankAccountMovements,
  getBankAccounts,
  postBankAccount,
  putBankAccount,
} from "../controllers/accountController.js";
import { ROLES } from "../constants/index.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  accountIdParamSchema,
  accountQuerySchema,
  createBankAccountSchema,
  updateBankAccountSchema,
} from "../validations/accountValidation.js";

export const bankRoutes = Router();

bankRoutes.use(protect);
bankRoutes.get("/accounts", validate(accountQuerySchema, "query"), getBankAccounts);
bankRoutes.get(
  "/accounts/:id/movements",
  validate(accountIdParamSchema, "params"),
  getBankAccountMovements
);
bankRoutes.post(
  "/accounts",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(createBankAccountSchema),
  postBankAccount
);
bankRoutes.put(
  "/accounts/:id",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(accountIdParamSchema, "params"),
  validate(updateBankAccountSchema),
  putBankAccount
);

