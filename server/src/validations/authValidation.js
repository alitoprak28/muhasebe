import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().email("Gecerli bir e-posta giriniz.").trim().toLowerCase(),
    password: z.string().min(6, "Parola en az 6 karakter olmali."),
  })
  .strict();

