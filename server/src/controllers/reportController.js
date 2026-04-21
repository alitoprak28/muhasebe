import {
  getBankMovementReport,
  getCashMovementReport,
  getCurrentStatementReport,
  getDailyIncomeReport,
  getExpenseCategoryReport,
  getMonthlyFinancialReport,
  getOverviewReport,
} from "../services/reportService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getOverview = asyncHandler(async (req, res) => {
  const data = await getOverviewReport(req.query);

  return sendSuccess(res, {
    message: "Genel finans raporu getirildi.",
    data,
  });
});

export const getDailyIncome = asyncHandler(async (req, res) => {
  const data = await getDailyIncomeReport(req.query);

  return sendSuccess(res, {
    message: "Gunluk gelir raporu getirildi.",
    data,
  });
});

export const getMonthlyFinancials = asyncHandler(async (req, res) => {
  const data = await getMonthlyFinancialReport(req.query);

  return sendSuccess(res, {
    message: "Aylik gelir-gider raporu getirildi.",
    data,
  });
});

export const getExpenseCategories = asyncHandler(async (req, res) => {
  const data = await getExpenseCategoryReport(req.query);

  return sendSuccess(res, {
    message: "Kategori bazli gider raporu getirildi.",
    data,
  });
});

export const getCurrentStatementReportById = asyncHandler(async (req, res) => {
  const data = await getCurrentStatementReport(req.params.id, req.query);

  return sendSuccess(res, {
    message: "Cari ekstre raporu getirildi.",
    data,
  });
});

export const getCashMovementReportById = asyncHandler(async (req, res) => {
  const data = await getCashMovementReport(req.params.id, req.query);

  return sendSuccess(res, {
    message: "Kasa hareket raporu getirildi.",
    data,
  });
});

export const getBankMovementReportById = asyncHandler(async (req, res) => {
  const data = await getBankMovementReport(req.params.id, req.query);

  return sendSuccess(res, {
    message: "Banka hareket raporu getirildi.",
    data,
  });
});

