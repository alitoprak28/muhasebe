import { z } from "zod";
import {
  ACCOUNT_MODELS,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
} from "../constants/index.js";
import {
  dateSchema,
  objectIdSchema,
  paginationQuerySchema,
  positiveNumberSchema,
} from "./common.js";

export const createIncomeSchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    description: z.string().trim().max(500).optional(),
    category: z.enum(INCOME_CATEGORIES),
    amount: positiveNumberSchema,
    date: dateSchema,
    paymentMethod: z.enum(PAYMENT_METHODS),
    currentAccount: objectIdSchema.optional().or(z.literal("")),
    documentNumber: z.string().trim().max(50).optional(),
    accountModel: z.enum(ACCOUNT_MODELS),
    account: objectIdSchema,
  })
  .strict();

export const updateIncomeSchema = createIncomeSchema.partial();

export const incomeQuerySchema = paginationQuerySchema
  .extend({
    category: z.enum(INCOME_CATEGORIES).optional(),
    currentAccount: objectIdSchema.optional(),
  })
  .strip();

export const incomeIdParamSchema = z.object({
  id: objectIdSchema,
});
