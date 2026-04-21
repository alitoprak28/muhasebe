import { Expense } from "../models/Expense.js";
import { Income } from "../models/Income.js";
import { Invoice } from "../models/Invoice.js";
import { buildDateRangeFilter } from "../utils/queryHelpers.js";
import { getAccountMovements } from "./accountService.js";
import { getCurrentStatement } from "./currentService.js";

export const getOverviewReport = async (query) => {
  const incomeFilter = buildDateRangeFilter("date", query);
  const invoiceFilter = buildDateRangeFilter("issueDate", query);

  const [incomeSummary, expenseSummary, invoiceSummary] = await Promise.all([
    Income.aggregate([
      { $match: incomeFilter },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: incomeFilter },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Invoice.aggregate([
      { $match: invoiceFilter },
      {
        $group: {
          _id: null,
          totalOutstanding: { $sum: "$remainingAmount" },
          totalInvoiced: { $sum: "$grandTotal" },
        },
      },
    ]),
  ]);

  return {
    cards: {
      totalIncome: incomeSummary[0]?.total || 0,
      totalExpense: expenseSummary[0]?.total || 0,
      netResult: (incomeSummary[0]?.total || 0) - (expenseSummary[0]?.total || 0),
      outstandingReceivables: invoiceSummary[0]?.totalOutstanding || 0,
      totalInvoiced: invoiceSummary[0]?.totalInvoiced || 0,
    },
  };
};

export const getDailyIncomeReport = async (query) => {
  const filters = buildDateRangeFilter("date", query);

  const rows = await Income.aggregate([
    { $match: filters },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return rows.map((row) => ({
    date: row._id,
    total: row.total,
    count: row.count,
  }));
};

export const getMonthlyFinancialReport = async (query) => {
  const filters = buildDateRangeFilter("date", query);

  const [incomeRows, expenseRows] = await Promise.all([
    Income.aggregate([
      { $match: filters },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Expense.aggregate([
      { $match: filters },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const monthMap = new Map();

  incomeRows.forEach((row) => {
    monthMap.set(row._id, { month: row._id, income: row.total, expense: 0 });
  });

  expenseRows.forEach((row) => {
    const existing = monthMap.get(row._id) || { month: row._id, income: 0, expense: 0 };
    existing.expense = row.total;
    monthMap.set(row._id, existing);
  });

  return [...monthMap.values()]
    .sort((left, right) => left.month.localeCompare(right.month))
    .map((row) => ({
      ...row,
      net: row.income - row.expense,
    }));
};

export const getExpenseCategoryReport = async (query) => {
  const filters = buildDateRangeFilter("date", query);

  const rows = await Expense.aggregate([
    { $match: filters },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const overall = rows.reduce((sum, row) => sum + row.total, 0);

  return rows.map((row) => ({
    category: row._id,
    total: row.total,
    count: row.count,
    percentage: overall ? (row.total / overall) * 100 : 0,
  }));
};

export const getCurrentStatementReport = async (currentId, query) =>
  getCurrentStatement(currentId, query);

export const getCashMovementReport = async (accountId, query) =>
  getAccountMovements("CashAccount", accountId, query);

export const getBankMovementReport = async (accountId, query) =>
  getAccountMovements("BankAccount", accountId, query);

