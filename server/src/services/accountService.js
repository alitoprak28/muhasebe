import mongoose from "mongoose";
import { BankAccount } from "../models/BankAccount.js";
import { CashAccount } from "../models/CashAccount.js";
import { Transaction } from "../models/Transaction.js";
import { ApiError } from "../utils/ApiError.js";
import { buildDateRangeFilter, parsePagination } from "../utils/queryHelpers.js";
import { resolveAccountModel } from "./helpers/modelRegistry.js";

const normalizeSearch = (modelName, query) => {
  if (!query.search) {
    return {};
  }

  if (modelName === "CashAccount") {
    return {
      $or: [
        { name: { $regex: query.search, $options: "i" } },
        { code: { $regex: query.search, $options: "i" } },
      ],
    };
  }

  return {
    $or: [
      { bankName: { $regex: query.search, $options: "i" } },
      { accountName: { $regex: query.search, $options: "i" } },
      { iban: { $regex: query.search, $options: "i" } },
    ],
  };
};

const listAccounts = async (modelName, query) => {
  const Model = resolveAccountModel(modelName);
  const { page, limit, skip } = parsePagination(query);
  const filters = {
    ...normalizeSearch(modelName, query),
  };

  if (query.status) {
    filters.status = query.status;
  }

  const [items, total] = await Promise.all([
    Model.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Model.countDocuments(filters),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getAccountModelDoc = async (modelName, id) => {
  const Model = resolveAccountModel(modelName);
  const account = await Model.findById(id);

  if (!account) {
    throw new ApiError(404, "Hesap bulunamadi.");
  }

  return account;
};

export const listCashAccounts = async (query) => listAccounts("CashAccount", query);

export const createCashAccount = async (payload) => {
  if (payload.isDefault) {
    await CashAccount.updateMany({}, { isDefault: false });
  }

  return CashAccount.create(payload);
};

export const updateCashAccount = async (id, payload) => {
  const account = await getAccountModelDoc("CashAccount", id);

  if (payload.isDefault) {
    await CashAccount.updateMany({ _id: { $ne: id } }, { isDefault: false });
  }

  Object.assign(account, payload);
  await account.save();

  return account;
};

export const listBankAccounts = async (query) => listAccounts("BankAccount", query);

export const createBankAccount = async (payload) => BankAccount.create(payload);

export const updateBankAccount = async (id, payload) => {
  const account = await getAccountModelDoc("BankAccount", id);

  Object.assign(account, payload);
  await account.save();

  return account;
};

export const getAccountMovements = async (modelName, id, query = {}) => {
  const account = await getAccountModelDoc(modelName, id);
  const { page, limit, skip } = parsePagination({
    page: query.page || 1,
    limit: query.limit || 20,
  });
  const filters = {
    accountModel: modelName,
    account: new mongoose.Types.ObjectId(id),
    ...buildDateRangeFilter("date", query),
  };

  const [items, total, summary] = await Promise.all([
    Transaction.find(filters)
      .populate("currentAccount", "name type")
      .populate("createdBy", "name role")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Transaction.countDocuments(filters),
    Transaction.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          totalIn: {
            $sum: {
              $cond: [{ $eq: ["$direction", "in"] }, "$amount", 0],
            },
          },
          totalOut: {
            $sum: {
              $cond: [{ $eq: ["$direction", "out"] }, "$amount", 0],
            },
          },
        },
      },
    ]),
  ]);

  return {
    account,
    movements: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      summary: {
        totalIn: summary[0]?.totalIn || 0,
        totalOut: summary[0]?.totalOut || 0,
        closingBalance: account.balance,
      },
    },
  };
};

