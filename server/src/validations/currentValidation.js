import { z } from "zod";
import {
  CURRENT_ACCOUNT_TYPES,
  USER_STATUSES,
} from "../constants/index.js";
import { objectIdSchema, paginationQuerySchema } from "./common.js";

export const createCurrentSchema = z
  .object({
    type: z.enum(CURRENT_ACCOUNT_TYPES),
    name: z.string().trim().min(2).max(160),
    phone: z.string().trim().max(40).optional(),
    email: z.string().email().trim().toLowerCase().optional().or(z.literal("")),
    address: z.string().trim().max(400).optional(),
    taxNumber: z.string().trim().max(32).optional(),
    identityNumber: z.string().trim().max(32).optional(),
    notes: z.string().trim().max(500).optional(),
    status: z.enum(USER_STATUSES).optional(),
  })
  .strict();

export const updateCurrentSchema = createCurrentSchema.partial();

export const currentQuerySchema = paginationQuerySchema
  .extend({
    type: z.enum(CURRENT_ACCOUNT_TYPES).optional(),
    status: z.enum(USER_STATUSES).optional(),
  })
  .strip();

export const currentStatementQuerySchema = z
  .object({
    startDate: z.string().trim().optional(),
    endDate: z.string().trim().optional(),
  })
  .strip();

export const currentIdParamSchema = z.object({
  id: objectIdSchema,
});

