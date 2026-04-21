import { z } from "zod";
import { USER_STATUSES } from "../constants/index.js";
import { objectIdSchema, paginationQuerySchema } from "./common.js";

export const createCashAccountSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    code: z.string().trim().min(2).max(20),
    currency: z.string().trim().min(3).max(3).optional(),
    description: z.string().trim().max(300).optional(),
    isDefault: z.boolean().optional(),
    status: z.enum(USER_STATUSES).optional(),
  })
  .strict();

export const updateCashAccountSchema = createCashAccountSchema.partial();

export const createBankAccountSchema = z
  .object({
    bankName: z.string().trim().min(2).max(120),
    accountName: z.string().trim().min(2).max(120),
    iban: z.string().trim().min(10).max(34),
    accountNumber: z.string().trim().max(32).optional(),
    branchCode: z.string().trim().max(20).optional(),
    currency: z.string().trim().min(3).max(3).optional(),
    status: z.enum(USER_STATUSES).optional(),
  })
  .strict();

export const updateBankAccountSchema = createBankAccountSchema.partial();

export const accountQuerySchema = paginationQuerySchema
  .extend({
    status: z.enum(USER_STATUSES).optional(),
  })
  .strip();

export const accountIdParamSchema = z.object({
  id: objectIdSchema,
});

