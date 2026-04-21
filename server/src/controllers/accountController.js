import {
  createBankAccount,
  createCashAccount,
  getAccountMovements,
  listBankAccounts,
  listCashAccounts,
  updateBankAccount,
  updateCashAccount,
} from "../services/accountService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getCashAccounts = asyncHandler(async (req, res) => {
  const { items, meta } = await listCashAccounts(req.query);

  return sendSuccess(res, {
    message: "Kasa hesaplari listelendi.",
    data: items,
    meta,
  });
});

export const postCashAccount = asyncHandler(async (req, res) => {
  const data = await createCashAccount(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Kasa hesabi olusturuldu.",
    data,
  });
});

export const putCashAccount = asyncHandler(async (req, res) => {
  const data = await updateCashAccount(req.params.id, req.body);

  return sendSuccess(res, {
    message: "Kasa hesabi guncellendi.",
    data,
  });
});

export const getCashAccountMovements = asyncHandler(async (req, res) => {
  const data = await getAccountMovements("CashAccount", req.params.id, req.query);

  return sendSuccess(res, {
    message: "Kasa hareketleri getirildi.",
    data: data.movements,
    meta: {
      ...data.meta,
      account: data.account,
    },
  });
});

export const getBankAccounts = asyncHandler(async (req, res) => {
  const { items, meta } = await listBankAccounts(req.query);

  return sendSuccess(res, {
    message: "Banka hesaplari listelendi.",
    data: items,
    meta,
  });
});

export const postBankAccount = asyncHandler(async (req, res) => {
  const data = await createBankAccount(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Banka hesabi olusturuldu.",
    data,
  });
});

export const putBankAccount = asyncHandler(async (req, res) => {
  const data = await updateBankAccount(req.params.id, req.body);

  return sendSuccess(res, {
    message: "Banka hesabi guncellendi.",
    data,
  });
});

export const getBankAccountMovements = asyncHandler(async (req, res) => {
  const data = await getAccountMovements("BankAccount", req.params.id, req.query);

  return sendSuccess(res, {
    message: "Banka hareketleri getirildi.",
    data: data.movements,
    meta: {
      ...data.meta,
      account: data.account,
    },
  });
});

