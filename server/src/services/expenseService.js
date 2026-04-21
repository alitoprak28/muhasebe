import { Expense } from "../models/Expense.js";
import { ApiError } from "../utils/ApiError.js";
import { buildDateRangeFilter, parsePagination } from "../utils/queryHelpers.js";
import {
  syncAccountBalancesForSnapshots,
  syncCurrentBalances,
} from "./helpers/balanceService.js";
import {
  deleteTransactionsByReference,
  upsertReferenceTransaction,
} from "./transactionService.js";

const expensePopulate = (query) =>
  query
    .populate("currentAccount", "name type")
    .populate("createdBy", "name role")
    .populate("account")
    .sort({ date: -1, createdAt: -1 });

const normalizeExpensePayload = (payload) => ({
  ...payload,
  currentAccount: payload.currentAccount || null,
  dueDate: payload.dueDate || null,
  receiptNumber: payload.receiptNumber || "",
  description: payload.description || "",
  recurrenceRule: payload.recurrenceRule || "",
  accountModel: payload.accountModel || null,
  account: payload.account || null,
  status: payload.status || "paid",
  isRecurring: payload.isRecurring || false,
});

const syncExpenseTransaction = async (expense, userId) => {
  if (expense.status === "paid" && expense.accountModel && expense.account) {
    await upsertReferenceTransaction({
      type: "expense",
      direction: "out",
      amount: expense.amount,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      accountModel: expense.accountModel,
      account: expense.account,
      currentAccount: expense.currentAccount,
      referenceModel: "Expense",
      referenceId: expense._id,
      note: expense.title,
      createdBy: userId,
    });
    return;
  }

  await deleteTransactionsByReference("Expense", expense._id);
};

export const listExpenses = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filters = {
    ...buildDateRangeFilter("date", query),
  };

  if (query.category) {
    filters.category = query.category;
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.currentAccount) {
    filters.currentAccount = query.currentAccount;
  }

  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { receiptNumber: { $regex: query.search, $options: "i" } },
    ];
  }

  const [items, total, summary] = await Promise.all([
    expensePopulate(Expense.find(filters)).skip(skip).limit(limit),
    Expense.countDocuments(filters),
    Expense.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0],
            },
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $ne: ["$status", "paid"] }, "$amount", 0],
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
        totalAmount: summary[0]?.totalAmount || 0,
        paidAmount: summary[0]?.paidAmount || 0,
        pendingAmount: summary[0]?.pendingAmount || 0,
      },
    },
  };
};

export const getExpenseById = async (id) => {
  const expense = await expensePopulate(Expense.findById(id));

  if (!expense) {
    throw new ApiError(404, "Gider kaydi bulunamadi.");
  }

  return expense;
};

export const createExpense = async (payload, user) => {
  const normalizedPayload = normalizeExpensePayload(payload);

  const expense = await Expense.create({
    ...normalizedPayload,
    createdBy: user._id,
  });

  await syncExpenseTransaction(expense, user._id);
  await syncAccountBalancesForSnapshots([
    { accountModel: expense.accountModel, account: expense.account?.toString() },
  ]);
  await syncCurrentBalances([expense.currentAccount?.toString()]);

  return getExpenseById(expense._id);
};

export const updateExpense = async (id, payload, user) => {
  const expense = await Expense.findById(id);

  if (!expense) {
    throw new ApiError(404, "Gider kaydi bulunamadi.");
  }

  const previousSnapshot = {
    accountModel: expense.accountModel,
    account: expense.account?.toString(),
    currentAccount: expense.currentAccount?.toString(),
  };

  Object.assign(expense, normalizeExpensePayload(payload));
  await expense.save();

  await syncExpenseTransaction(expense, user._id);
  await syncAccountBalancesForSnapshots([
    previousSnapshot,
    { accountModel: expense.accountModel, account: expense.account?.toString() },
  ]);
  await syncCurrentBalances([previousSnapshot.currentAccount, expense.currentAccount?.toString()]);

  return getExpenseById(expense._id);
};

export const deleteExpense = async (id) => {
  const expense = await Expense.findById(id);

  if (!expense) {
    throw new ApiError(404, "Gider kaydi bulunamadi.");
  }

  const snapshot = {
    accountModel: expense.accountModel,
    account: expense.account?.toString(),
    currentAccount: expense.currentAccount?.toString(),
  };

  await deleteTransactionsByReference("Expense", expense._id);
  await expense.deleteOne();

  await syncAccountBalancesForSnapshots([snapshot]);
  await syncCurrentBalances([snapshot.currentAccount]);
};

