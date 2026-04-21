import mongoose from "mongoose";
import { Expense } from "../../models/Expense.js";
import { Invoice } from "../../models/Invoice.js";
import { CurrentAccount } from "../../models/CurrentAccount.js";
import { Transaction } from "../../models/Transaction.js";
import { resolveAccountModel } from "./modelRegistry.js";

export const recalculateAccountBalance = async (accountModel, accountId) => {
  if (!accountModel || !accountId) {
    return;
  }

  const Model = resolveAccountModel(accountModel);
  const objectId = new mongoose.Types.ObjectId(accountId);

  const [summary] = await Transaction.aggregate([
    {
      $match: {
        accountModel,
        account: objectId,
      },
    },
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
  ]);

  const balance = (summary?.totalIn || 0) - (summary?.totalOut || 0);

  await Model.findByIdAndUpdate(accountId, { balance });
};

export const recalculateCurrentBalance = async (currentAccountId) => {
  if (!currentAccountId) {
    return;
  }

  const objectId = new mongoose.Types.ObjectId(currentAccountId);

  const [invoiceSummary] = await Invoice.aggregate([
    {
      $match: {
        currentAccount: objectId,
      },
    },
    {
      $group: {
        _id: null,
        receivable: {
          $sum: "$remainingAmount",
        },
      },
    },
  ]);

  const [pendingExpenseSummary] = await Expense.aggregate([
    {
      $match: {
        currentAccount: objectId,
        status: {
          $ne: "paid",
        },
      },
    },
    {
      $group: {
        _id: null,
        payable: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const balance = (invoiceSummary?.receivable || 0) - (pendingExpenseSummary?.payable || 0);

  await CurrentAccount.findByIdAndUpdate(currentAccountId, { balance });
};

export const syncAccountBalancesForSnapshots = async (snapshots) => {
  const uniqueTargets = new Map();

  snapshots
    .filter((snapshot) => snapshot?.accountModel && snapshot?.account)
    .forEach((snapshot) => {
      const key = `${snapshot.accountModel}:${snapshot.account}`;
      uniqueTargets.set(key, snapshot);
    });

  await Promise.all(
    [...uniqueTargets.values()].map((snapshot) =>
      recalculateAccountBalance(snapshot.accountModel, snapshot.account)
    )
  );
};

export const syncCurrentBalances = async (currentIds) => {
  const uniqueIds = [...new Set(currentIds.filter(Boolean).map(String))];

  await Promise.all(uniqueIds.map((id) => recalculateCurrentBalance(id)));
};

