import { z } from "zod";
import {
  ACCOUNT_MODELS,
  EXPENSE_CATEGORIES,
  EXPENSE_STATUSES,
  PAYMENT_METHODS,
} from "../constants/index.js";
import {
  dateSchema,
  objectIdSchema,
  optionalDateSchema,
  paginationQuerySchema,
  positiveNumberSchema,
} from "./common.js";

const expenseBaseSchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    description: z.string().trim().max(500).optional(),
    category: z.enum(EXPENSE_CATEGORIES),
    amount: positiveNumberSchema,
    date: dateSchema,
    dueDate: optionalDateSchema,
    paymentMethod: z.enum(PAYMENT_METHODS),
    currentAccount: objectIdSchema.optional().or(z.literal("")),
    receiptNumber: z.string().trim().max(50).optional(),
    status: z.enum(EXPENSE_STATUSES).optional(),
    isRecurring: z.boolean().optional(),
    recurrenceRule: z.string().trim().max(60).optional(),
    accountModel: z.enum(ACCOUNT_MODELS).optional().nullable(),
    account: objectIdSchema.optional().nullable(),
  })
  .strict();

export const createExpenseSchema = expenseBaseSchema.superRefine((value, ctx) => {
  if (value.status === "paid" && (!value.accountModel || !value.account)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Odenmis giderler icin hesap secimi zorunludur.",
      path: ["account"],
    });
  }
});

export const updateExpenseSchema = expenseBaseSchema.partial();

export const expenseQuerySchema = paginationQuerySchema
  .extend({
    category: z.enum(EXPENSE_CATEGORIES).optional(),
    status: z.enum(EXPENSE_STATUSES).optional(),
    currentAccount: objectIdSchema.optional(),
  })
  .strip();

export const expenseIdParamSchema = z.object({
  id: objectIdSchema,
});
