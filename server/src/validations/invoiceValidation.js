import { z } from "zod";
import {
  ACCOUNT_MODELS,
  INVOICE_STATUSES,
  PAYMENT_METHODS,
} from "../constants/index.js";
import {
  dateSchema,
  nonNegativeNumberSchema,
  objectIdSchema,
  paginationQuerySchema,
  percentageNumberSchema,
  positiveNumberSchema,
} from "./common.js";

const invoiceItemSchema = z.object({
  description: z.string().trim().min(2).max(160),
  quantity: positiveNumberSchema,
  unitPrice: nonNegativeNumberSchema,
  vatRate: percentageNumberSchema,
});

export const createInvoiceSchema = z
  .object({
    invoiceNumber: z.string().trim().min(3).max(40),
    currentAccount: objectIdSchema,
    issueDate: dateSchema,
    dueDate: dateSchema,
    items: z.array(invoiceItemSchema).min(1),
    notes: z.string().trim().max(500).optional(),
  })
  .strict();

export const updateInvoiceSchema = createInvoiceSchema.partial();

export const invoiceQuerySchema = paginationQuerySchema
  .extend({
    status: z.enum(INVOICE_STATUSES).optional(),
    currentAccount: objectIdSchema.optional(),
  })
  .strip();

export const recordInvoicePaymentSchema = z
  .object({
    amount: positiveNumberSchema,
    paymentDate: dateSchema,
    paymentMethod: z.enum(PAYMENT_METHODS),
    accountModel: z.enum(ACCOUNT_MODELS),
    account: objectIdSchema,
    note: z.string().trim().max(250).optional(),
  })
  .strict();

export const invoiceIdParamSchema = z.object({
  id: objectIdSchema,
});
