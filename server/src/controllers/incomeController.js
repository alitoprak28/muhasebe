import {
  createIncome,
  deleteIncome,
  getIncomeById,
  listIncomes,
  updateIncome,
} from "../services/incomeService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getIncomes = asyncHandler(async (req, res) => {
  const { items, meta } = await listIncomes(req.query);

  return sendSuccess(res, {
    message: "Gelir kayitlari listelendi.",
    data: items,
    meta,
  });
});

export const getIncome = asyncHandler(async (req, res) => {
  const data = await getIncomeById(req.params.id);

  return sendSuccess(res, {
    message: "Gelir detayi getirildi.",
    data,
  });
});

export const postIncome = asyncHandler(async (req, res) => {
  const data = await createIncome(req.body, req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Gelir kaydi olusturuldu.",
    data,
  });
});

export const putIncome = asyncHandler(async (req, res) => {
  const data = await updateIncome(req.params.id, req.body, req.user);

  return sendSuccess(res, {
    message: "Gelir kaydi guncellendi.",
    data,
  });
});

export const removeIncome = asyncHandler(async (req, res) => {
  await deleteIncome(req.params.id);

  return sendSuccess(res, {
    message: "Gelir kaydi silindi.",
    data: null,
  });
});

