import { Router } from "express";
import {
  getCurrent,
  getCurrentLedger,
  getCurrents,
  postCurrent,
  putCurrent,
} from "../controllers/currentController.js";
import { ROLES } from "../constants/index.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  createCurrentSchema,
  currentIdParamSchema,
  currentQuerySchema,
  currentStatementQuerySchema,
  updateCurrentSchema,
} from "../validations/currentValidation.js";

export const currentRoutes = Router();

currentRoutes.use(protect);
currentRoutes.get("/", validate(currentQuerySchema, "query"), getCurrents);
currentRoutes.get(
  "/:id/statement",
  validate(currentIdParamSchema, "params"),
  validate(currentStatementQuerySchema, "query"),
  getCurrentLedger
);
currentRoutes.get("/:id", validate(currentIdParamSchema, "params"), getCurrent);
currentRoutes.post(
  "/",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(createCurrentSchema),
  postCurrent
);
currentRoutes.put(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(currentIdParamSchema, "params"),
  validate(updateCurrentSchema),
  putCurrent
);

