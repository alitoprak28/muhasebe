import { CurrentAccount } from "../models/CurrentAccount.js";
import { Expense } from "../models/Expense.js";
import { Income } from "../models/Income.js";
import { Invoice } from "../models/Invoice.js";
import { Transaction } from "../models/Transaction.js";
import { ApiError } from "../utils/ApiError.js";
import { buildDateRangeFilter, parsePagination } from "../utils/queryHelpers.js";

export const listCurrents = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filters = {};

  if (query.type) {
    filters.type = query.type;
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { phone: { $regex: query.search, $options: "i" } },
    ];
  }

  const [items, total, summary] = await Promise.all([
    CurrentAccount.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    CurrentAccount.countDocuments(filters),
    CurrentAccount.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$balance" },
          positiveBalanceCount: {
            $sum: {
              $cond: [{ $gt: ["$balance", 0] }, 1, 0],
            },
          },
          negativeBalanceCount: {
            $sum: {
              $cond: [{ $lt: ["$balance", 0] }, 1, 0],
            },
          },
        },
      },
    ]),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      summary: {
        totalBalance: summary[0]?.totalBalance || 0,
        positiveBalanceCount: summary[0]?.positiveBalanceCount || 0,
        negativeBalanceCount: summary[0]?.negativeBalanceCount || 0,
      },
    },
  };
};

export const createCurrent = async (payload) => CurrentAccount.create(payload);

export const updateCurrent = async (id, payload) => {
  const current = await CurrentAccount.findById(id);

  if (!current) {
    throw new ApiError(404, "Cari hesap bulunamadi.");
  }

  Object.assign(current, payload);
  await current.save();

  return current;
};

export const getCurrentById = async (id) => {
  const current = await CurrentAccount.findById(id);

  if (!current) {
    throw new ApiError(404, "Cari hesap bulunamadi.");
  }

  return current;
};

export const getCurrentStatement = async (id, query = {}) => {
  const current = await getCurrentById(id);
  const dateFilter = buildDateRangeFilter("date", query);
  const invoiceDateFilter = buildDateRangeFilter("issueDate", query);

  const [incomes, expenses, invoices, invoicePayments] = await Promise.all([
    Income.find({ currentAccount: id, ...dateFilter }).sort({ date: -1 }),
    Expense.find({ currentAccount: id, ...dateFilter }).sort({ date: -1 }),
    Invoice.find({ currentAccount: id, ...invoiceDateFilter }).sort({ issueDate: -1 }),
    Transaction.find({
      currentAccount: id,
      type: "invoice_payment",
      ...dateFilter,
    }).sort({ date: -1 }),
  ]);

  const movements = [
    ...invoices.map((invoice) => ({
      id: invoice._id,
      module: "invoice",
      title: `Fatura ${invoice.invoiceNumber}`,
      direction: "debit",
      amount: invoice.grandTotal,
      date: invoice.issueDate,
      status: invoice.status,
      documentNumber: invoice.invoiceNumber,
    })),
    ...invoicePayments.map((payment) => ({
      id: payment._id,
      module: "invoice_payment",
      title: "Fatura tahsilati",
      direction: "credit",
      amount: payment.amount,
      date: payment.date,
      status: "completed",
      documentNumber: payment.transactionNumber,
    })),
    ...incomes.map((income) => ({
      id: income._id,
      module: "income",
      title: income.title,
      direction: "credit",
      amount: income.amount,
      date: income.date,
      status: "completed",
      documentNumber: income.documentNumber,
    })),
    ...expenses.map((expense) => ({
      id: expense._id,
      module: "expense",
      title: expense.title,
      direction: "debit",
      amount: expense.amount,
      date: expense.date,
      status: expense.status,
      documentNumber: expense.receiptNumber,
    })),
  ].sort((left, right) => new Date(right.date) - new Date(left.date));

  const summary = {
    balance: current.balance,
    invoiceTotal: invoices.reduce((sum, item) => sum + item.grandTotal, 0),
    outstandingTotal: invoices.reduce((sum, item) => sum + item.remainingAmount, 0),
    incomeCollections: incomes.reduce((sum, item) => sum + item.amount, 0),
    expenseTotal: expenses.reduce((sum, item) => sum + item.amount, 0),
  };

  return {
    current,
    summary,
    movements,
  };
};

