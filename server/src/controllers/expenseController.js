import {
  createExpense,
  deleteExpense,
  getExpenseById,
  listExpenses,
  updateExpense,
} from "../services/expenseService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getExpenses = asyncHandler(async (req, res) => {
  const { items, meta } = await listExpenses(req.query);

  return sendSuccess(res, {
    message: "Gider kayitlari listelendi.",
    data: items,
    meta,
  });
});

export const getExpense = asyncHandler(async (req, res) => {
  const data = await getExpenseById(req.params.id);

  return sendSuccess(res, {
    message: "Gider detayi getirildi.",
    data,
  });
});

export const postExpense = asyncHandler(async (req, res) => {
  const data = await createExpense(req.body, req.user);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Gider kaydi olusturuldu.",
    data,
  });
});

export const putExpense = asyncHandler(async (req, res) => {
  const data = await updateExpense(req.params.id, req.body, req.user);

  return sendSuccess(res, {
    message: "Gider kaydi guncellendi.",
    data,
  });
});

export const removeExpense = asyncHandler(async (req, res) => {
  await deleteExpense(req.params.id);

  return sendSuccess(res, {
    message: "Gider kaydi silindi.",
    data: null,
  });
});

