import { z } from "zod";
import {
  ACCOUNT_MODELS,
  TRANSACTION_TYPES,
} from "../constants/index.js";
import { objectIdSchema, paginationQuerySchema } from "./common.js";

export const transactionQuerySchema = paginationQuerySchema
  .extend({
    type: z.enum(TRANSACTION_TYPES).optional(),
    accountModel: z.enum(ACCOUNT_MODELS).optional(),
    accountId: objectIdSchema.optional(),
    currentAccount: objectIdSchema.optional(),
  })
  .strip();

