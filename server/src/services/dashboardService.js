import { Expense } from "../models/Expense.js";
import { Income } from "../models/Income.js";
import { Invoice } from "../models/Invoice.js";
import { CurrentAccount } from "../models/CurrentAccount.js";
import { CashAccount } from "../models/CashAccount.js";
import { BankAccount } from "../models/BankAccount.js";
import { Transaction } from "../models/Transaction.js";
import { lastNMonths, startOfMonth } from "../utils/finance.js";

export const getDashboardOverview = async () => {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const months = lastNMonths(6);

  const [
    incomeSummary,
    expenseSummary,
    pendingReceivables,
    latestTransactions,
    expenseCategoryBreakdown,
    overdueInvoicesCount,
    pendingExpensesCount,
    currentCount,
    cashAccounts,
    bankAccounts,
  ] = await Promise.all([
    Income.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Invoice.aggregate([{ $group: { _id: null, total: { $sum: "$remainingAmount" } } }]),
    Transaction.find()
      .populate("currentAccount", "name type")
      .sort({ date: -1, createdAt: -1 })
      .limit(8),
    Expense.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: "$amount" },
        },
      },
      { $sort: { value: -1 } },
    ]),
    Invoice.countDocuments({
      status: { $in: ["pending", "partial"] },
      dueDate: { $lt: now },
    }),
    Expense.countDocuments({
      status: { $ne: "paid" },
    }),
    CurrentAccount.countDocuments({ status: "active" }),
    CashAccount.find({ status: "active" }).sort({ balance: 1 }),
    BankAccount.find({ status: "active" }).sort({ balance: 1 }),
  ]);

  const monthlyTrend = await Promise.all(
    months.map(async (month) => {
      const [incomeItems, expenseItems] = await Promise.all([
        Income.aggregate([
          {
            $match: {
              date: { $gte: month.start, $lte: month.end },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Expense.aggregate([
          {
            $match: {
              date: { $gte: month.start, $lte: month.end },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

      return {
        month: month.label,
        income: incomeItems[0]?.total || 0,
        expense: expenseItems[0]?.total || 0,
      };
    })
  );

  const [collectedPayments] = await Income.aggregate([
    {
      $match: {
        date: { $gte: currentMonthStart },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const alerts = [
    overdueInvoicesCount > 0
      ? {
          type: "critical",
          title: "Vadesi gecmis faturalar mevcut",
          description: `${overdueInvoicesCount} fatura icin tahsilat takibi gerekiyor.`,
        }
      : null,
    pendingExpensesCount > 0
      ? {
          type: "warning",
          title: "Bekleyen giderler var",
          description: `${pendingExpensesCount} gider kaydi odeme planinda bekliyor.`,
        }
      : null,
    cashAccounts[0] && cashAccounts[0].balance < 5000
      ? {
          type: "info",
          title: "Dusuk kasa bakiyesi",
          description: `${cashAccounts[0].name} bakiyesi kritik esige yaklasti.`,
        }
      : null,
  ].filter(Boolean);

  return {
    summary: {
      totalIncome: incomeSummary[0]?.total || 0,
      totalExpense: expenseSummary[0]?.total || 0,
      netBalance: (incomeSummary[0]?.total || 0) - (expenseSummary[0]?.total || 0),
      collectedPayments: collectedPayments?.total || 0,
      pendingReceivables: pendingReceivables[0]?.total || 0,
      activeCurrents: currentCount,
    },
    charts: {
      monthlyTrend,
      expenseCategoryBreakdown: expenseCategoryBreakdown.map((item) => ({
        category: item._id,
        value: item.value,
      })),
    },
    latestTransactions,
    alerts,
    liquidity: {
      cashBalance: cashAccounts.reduce((sum, item) => sum + item.balance, 0),
      bankBalance: bankAccounts.reduce((sum, item) => sum + item.balance, 0),
      cashAccounts,
      bankAccounts,
    },
  };
};

