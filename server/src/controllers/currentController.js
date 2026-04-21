import {
  createCurrent,
  getCurrentById,
  getCurrentStatement,
  listCurrents,
  updateCurrent,
} from "../services/currentService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getCurrents = asyncHandler(async (req, res) => {
  const { items, meta } = await listCurrents(req.query);

  return sendSuccess(res, {
    message: "Cari hesaplar listelendi.",
    data: items,
    meta,
  });
});

export const postCurrent = asyncHandler(async (req, res) => {
  const data = await createCurrent(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Cari hesap olusturuldu.",
    data,
  });
});

export const putCurrent = asyncHandler(async (req, res) => {
  const data = await updateCurrent(req.params.id, req.body);

  return sendSuccess(res, {
    message: "Cari hesap guncellendi.",
    data,
  });
});

export const getCurrent = asyncHandler(async (req, res) => {
  const data = await getCurrentById(req.params.id);

  return sendSuccess(res, {
    message: "Cari hesap detayi getirildi.",
    data,
  });
});

export const getCurrentLedger = asyncHandler(async (req, res) => {
  const data = await getCurrentStatement(req.params.id, req.query);

  return sendSuccess(res, {
    message: "Cari ekstre bilgileri getirildi.",
    data,
  });
});

