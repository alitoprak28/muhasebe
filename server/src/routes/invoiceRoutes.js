import { Router } from "express";
import {
  getInvoice,
  getInvoices,
  payInvoice,
  postInvoice,
  putInvoice,
  removeInvoice,
} from "../controllers/invoiceController.js";
import { ROLES } from "../constants/index.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  createInvoiceSchema,
  invoiceIdParamSchema,
  invoiceQuerySchema,
  recordInvoicePaymentSchema,
  updateInvoiceSchema,
} from "../validations/invoiceValidation.js";

export const invoiceRoutes = Router();

invoiceRoutes.use(protect);
invoiceRoutes.get("/", validate(invoiceQuerySchema, "query"), getInvoices);
invoiceRoutes.get("/:id", validate(invoiceIdParamSchema, "params"), getInvoice);
invoiceRoutes.post(
  "/",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(createInvoiceSchema),
  postInvoice
);
invoiceRoutes.put(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(invoiceIdParamSchema, "params"),
  validate(updateInvoiceSchema),
  putInvoice
);
invoiceRoutes.patch(
  "/:id/payment",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(invoiceIdParamSchema, "params"),
  validate(recordInvoicePaymentSchema),
  payInvoice
);
invoiceRoutes.delete(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.ACCOUNTANT),
  validate(invoiceIdParamSchema, "params"),
  removeInvoice
);

