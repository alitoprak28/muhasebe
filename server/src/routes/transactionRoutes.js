import { Router } from "express";
import { getTransactions } from "../controllers/transactionController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { transactionQuerySchema } from "../validations/transactionValidation.js";

export const transactionRoutes = Router();

transactionRoutes.use(protect);
transactionRoutes.get("/", validate(transactionQuerySchema, "query"), getTransactions);

