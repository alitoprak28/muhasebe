import mongoose from "mongoose";
import { Transaction } from "../models/Transaction.js";
import { ApiError } from "../utils/ApiError.js";
import { buildDateRangeFilter, parsePagination } from "../utils/queryHelpers.js";
import { generateReferenceCode } from "./helpers/referenceCode.js";

const transactionPopulate = (query) =>
  query
    .populate("currentAccount", "name type")
    .populate("createdBy", "name role")
    .populate("account")
    .sort({ date: -1, createdAt: -1 });

export const createTransaction = async (payload) => {
  const transaction = await Transaction.create({
    transactionNumber: payload.transactionNumber || generateReferenceCode("TRX"),
    ...payload,
  });

  return transactionPopulate(Transaction.findById(transaction._id));
};

export const upsertReferenceTransaction = async (payload) => {
  const existingTransaction = await Transaction.findOne({
    referenceModel: payload.referenceModel,
    referenceId: payload.referenceId,
    type: payload.type,
  });

  if (existingTransaction) {
    existingTransaction.direction = payload.direction;
    existingTransaction.amount = payload.amount;
    existingTransaction.date = payload.date;
    existingTransaction.paymentMethod = payload.paymentMethod || "";
    existingTransaction.accountModel = payload.accountModel || null;
    existingTransaction.account = payload.account || null;
    existingTransaction.currentAccount = payload.currentAccount || null;
    existingTransaction.note = payload.note || "";
    existingTransaction.createdBy = payload.createdBy;

    await existingTransaction.save();
    return transactionPopulate(Transaction.findById(existingTransaction._id));
  }

  return createTransaction(payload);
};

export const deleteTransactionsByReference = async (referenceModel, referenceId) => {
  await Transaction.deleteMany({
    referenceModel,
    referenceId,
  });
};

export const listTransactions = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filters = {
    ...buildDateRangeFilter("date", query),
  };

  if (query.type) {
    filters.type = query.type;
  }

  if (query.accountModel) {
    filters.accountModel = query.accountModel;
  }

  if (query.accountId) {
    filters.account = new mongoose.Types.ObjectId(query.accountId);
  }

  if (query.currentAccount) {
    filters.currentAccount = new mongoose.Types.ObjectId(query.currentAccount);
  }

  if (query.search) {
    filters.$or = [
      { transactionNumber: { $regex: query.search, $options: "i" } },
      { note: { $regex: query.search, $options: "i" } },
    ];
  }

  const [items, total, summary] = await Promise.all([
    transactionPopulate(Transaction.find(filters)).skip(skip).limit(limit),
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
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      summary: {
        totalIn: summary[0]?.totalIn || 0,
        totalOut: summary[0]?.totalOut || 0,
      },
    },
  };
};

export const ensureTransactionExists = async (id) => {
  const transaction = await Transaction.findById(id);

  if (!transaction) {
    throw new ApiError(404, "Islem kaydi bulunamadi.");
  }

  return transaction;
};

