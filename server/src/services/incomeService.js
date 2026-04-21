import { Income } from "../models/Income.js";
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

const incomePopulate = (query) =>
  query
    .populate("currentAccount", "name type")
    .populate("createdBy", "name role")
    .populate("account")
    .sort({ date: -1, createdAt: -1 });

const normalizeIncomePayload = (payload) => ({
  ...payload,
  currentAccount: payload.currentAccount || null,
  description: payload.description || "",
  documentNumber: payload.documentNumber || "",
});

export const listIncomes = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filters = {
    ...buildDateRangeFilter("date", query),
  };

  if (query.category) {
    filters.category = query.category;
  }

  if (query.currentAccount) {
    filters.currentAccount = query.currentAccount;
  }

  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { documentNumber: { $regex: query.search, $options: "i" } },
    ];
  }

  const [items, total, summary] = await Promise.all([
    incomePopulate(Income.find(filters)).skip(skip).limit(limit),
    Income.countDocuments(filters),
    Income.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
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
      },
    },
  };
};

export const getIncomeById = async (id) => {
  const income = await incomePopulate(Income.findById(id));

  if (!income) {
    throw new ApiError(404, "Gelir kaydi bulunamadi.");
  }

  return income;
};

export const createIncome = async (payload, user) => {
  const normalizedPayload = normalizeIncomePayload(payload);

  const income = await Income.create({
    ...normalizedPayload,
    createdBy: user._id,
  });

  await upsertReferenceTransaction({
    type: "income",
    direction: "in",
    amount: income.amount,
    date: income.date,
    paymentMethod: income.paymentMethod,
    accountModel: income.accountModel,
    account: income.account,
    currentAccount: income.currentAccount,
    referenceModel: "Income",
    referenceId: income._id,
    note: income.title,
    createdBy: user._id,
  });

  await syncAccountBalancesForSnapshots([
    { accountModel: income.accountModel, account: income.account?.toString() },
  ]);
  await syncCurrentBalances([income.currentAccount?.toString()]);

  return getIncomeById(income._id);
};

export const updateIncome = async (id, payload, user) => {
  const income = await Income.findById(id);

  if (!income) {
    throw new ApiError(404, "Gelir kaydi bulunamadi.");
  }

  const previousSnapshot = {
    accountModel: income.accountModel,
    account: income.account?.toString(),
    currentAccount: income.currentAccount?.toString(),
  };

  Object.assign(income, normalizeIncomePayload(payload));
  await income.save();

  await upsertReferenceTransaction({
    type: "income",
    direction: "in",
    amount: income.amount,
    date: income.date,
    paymentMethod: income.paymentMethod,
    accountModel: income.accountModel,
    account: income.account,
    currentAccount: income.currentAccount,
    referenceModel: "Income",
    referenceId: income._id,
    note: income.title,
    createdBy: user._id,
  });

  await syncAccountBalancesForSnapshots([
    previousSnapshot,
    { accountModel: income.accountModel, account: income.account?.toString() },
  ]);
  await syncCurrentBalances([previousSnapshot.currentAccount, income.currentAccount?.toString()]);

  return getIncomeById(income._id);
};

export const deleteIncome = async (id) => {
  const income = await Income.findById(id);

  if (!income) {
    throw new ApiError(404, "Gelir kaydi bulunamadi.");
  }

  const snapshot = {
    accountModel: income.accountModel,
    account: income.account?.toString(),
    currentAccount: income.currentAccount?.toString(),
  };

  await deleteTransactionsByReference("Income", income._id);
  await income.deleteOne();

  await syncAccountBalancesForSnapshots([snapshot]);
  await syncCurrentBalances([snapshot.currentAccount]);
};

