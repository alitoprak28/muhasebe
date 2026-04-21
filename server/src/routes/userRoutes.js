import { Router } from "express";
import {
  getUsers,
  patchUserStatus,
  postUser,
} from "../controllers/userController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { ROLES } from "../constants/index.js";
import {
  createUserSchema,
  idParamSchema,
  updateUserStatusSchema,
  userQuerySchema,
} from "../validations/userValidation.js";

export const userRoutes = Router();

userRoutes.use(protect, authorize(ROLES.ADMIN));
userRoutes.get("/", validate(userQuerySchema, "query"), getUsers);
userRoutes.post("/", validate(createUserSchema), postUser);
userRoutes.patch(
  "/:id/status",
  validate(idParamSchema, "params"),
  validate(updateUserStatusSchema),
  patchUserStatus
);

