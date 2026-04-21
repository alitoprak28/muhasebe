import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  listInvoices,
  recordInvoicePayment,
  updateInvoice,
} from "../services/invoiceService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getInvoices = asyncHandler(async (req, res) => {
  const { items, meta } = await listInvoices(req.query);

  return sendSuccess(res, {
    message: "Faturalar listelendi.",
    data: items,
    meta,
  });
});

export const getInvoice = asyncHandler(async (req, res) => {
  const data = await getInvoiceById(req.params.id);

  return sendSuccess(res, {
    message: "Fatura detayi getirildi.",
    data,
  });
});

export const postInvoice = asyncHandler(async (req, res) => {
  const data = await createInvoice(req.body, req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Fatura olusturuldu.",
    data,
  });
});

export const putInvoice = asyncHandler(async (req, res) => {
  const data = await updateInvoice(req.params.id, req.body);

  return sendSuccess(res, {
    message: "Fatura guncellendi.",
    data,
  });
});

export const payInvoice = asyncHandler(async (req, res) => {
  const data = await recordInvoicePayment(req.params.id, req.body, req.user);

  return sendSuccess(res, {
    message: "Fatura tahsilati kaydedildi.",
    data,
  });
});

export const removeInvoice = asyncHandler(async (req, res) => {
  await deleteInvoice(req.params.id);

  return sendSuccess(res, {
    message: "Fatura silindi.",
    data: null,
  });
});

