import { z } from "zod";
import { objectIdSchema } from "./common.js";

export const reportQuerySchema = z
  .object({
    startDate: z.string().trim().optional(),
    endDate: z.string().trim().optional(),
    accountId: objectIdSchema.optional(),
  })
  .strip();
