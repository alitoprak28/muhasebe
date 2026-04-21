import { z } from "zod";

const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return Number(value);
};

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Gecersiz id formati.");

export const finiteNumberSchema = z.preprocess(
  toNumber,
  z.number().finite("Gecersiz sayi degeri.")
);

export const positiveNumberSchema = z.preprocess(
  toNumber,
  z.number().positive("Tutar sifirdan buyuk olmali.")
);

export const nonNegativeNumberSchema = z.preprocess(
  toNumber,
  z.number().min(0, "Negatif deger kabul edilmez.")
);

export const percentageNumberSchema = z.preprocess(
  toNumber,
  z.number().min(0, "Oran en az 0 olmali.").max(100, "Oran en fazla 100 olabilir.")
);

export const dateSchema = z.preprocess((value) => {
  if (!value) {
    return undefined;
  }

  return new Date(value);
}, z.date({ invalid_type_error: "Gecersiz tarih." }));

export const optionalDateSchema = z.preprocess((value) => {
  if (!value) {
    return undefined;
  }

  return new Date(value);
}, z.date({ invalid_type_error: "Gecersiz tarih." }).optional());

export const paginationQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().optional(),
    startDate: z.string().trim().optional(),
    endDate: z.string().trim().optional(),
  })
  .strip();
