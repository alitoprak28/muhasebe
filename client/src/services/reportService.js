import { api, unwrap } from "./api";
import { mockClient, withMockFallback } from "./mockClient";

export const reportService = {
  overview: (params) =>
    withMockFallback(
      () => api.get("/reports/overview", { params }).then(unwrap),
      () => mockClient.reports.overview(params)
    ),
  dailyIncome: (params) =>
    withMockFallback(
      () => api.get("/reports/income-daily", { params }).then(unwrap),
      () => mockClient.reports.dailyIncome(params)
    ),
  monthlyFinancials: (params) =>
    withMockFallback(
      () => api.get("/reports/monthly-financials", { params }).then(unwrap),
      () => mockClient.reports.monthlyFinancials(params)
    ),
  expenseCategories: (params) =>
    withMockFallback(
      () => api.get("/reports/expense-categories", { params }).then(unwrap),
      () => mockClient.reports.expenseCategories(params)
    ),
  currentStatement: (id, params) =>
    withMockFallback(
      () => api.get(`/reports/currents/${id}/statement`, { params }).then(unwrap),
      () => mockClient.reports.currentStatement(id, params)
    ),
  cashMovements: (id, params) =>
    withMockFallback(
      () => api.get(`/reports/cash/${id}/movements`, { params }).then(unwrap),
      () => mockClient.reports.cashMovements(id, params)
    ),
  bankMovements: (id, params) =>
    withMockFallback(
      () => api.get(`/reports/banks/${id}/movements`, { params }).then(unwrap),
      () => mockClient.reports.bankMovements(id, params)
    ),
};
