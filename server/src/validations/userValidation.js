import { z } from "zod";
import { ROLES, USER_STATUSES } from "../constants/index.js";
import { objectIdSchema, paginationQuerySchema } from "./common.js";

export const createUserSchema = z
  .object({
    name: z.string().trim().min(3).max(120),
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(6).max(64),
    role: z.enum(Object.values(ROLES)),
    status: z.enum(USER_STATUSES).optional(),
  })
  .strict();

export const updateUserStatusSchema = z
  .object({
    status: z.enum(USER_STATUSES),
  })
  .strict();

export const userQuerySchema = paginationQuerySchema
  .extend({
    role: z.enum(Object.values(ROLES)).optional(),
    status: z.enum(USER_STATUSES).optional(),
  })
  .strip();

export const idParamSchema = z.object({
  id: objectIdSchema,
});

