import { Invoice } from "../models/Invoice.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateInvoiceTotals } from "../utils/finance.js";
import { buildDateRangeFilter, parsePagination } from "../utils/queryHelpers.js";
import { syncAccountBalancesForSnapshots, syncCurrentBalances } from "./helpers/balanceService.js";
import { createTransaction, deleteTransactionsByReference } from "./transactionService.js";

const invoicePopulate = (query) =>
  query
    .populate("currentAccount", "name type email phone")
    .populate("createdBy", "name role")
    .sort({ issueDate: -1, createdAt: -1 });

const deriveInvoiceFinancialState = (grandTotal, paidAmount) => {
  const remainingAmount = Math.max(grandTotal - paidAmount, 0);
  let status = "pending";

  if (remainingAmount === 0) {
    status = "paid";
  } else if (paidAmount > 0) {
    status = "partial";
  }

  return { remainingAmount, status };
};

export const listInvoices = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filters = {
    ...buildDateRangeFilter("issueDate", query),
  };

  if (query.status) {
    filters.status = query.status;
  }

  if (query.currentAccount) {
    filters.currentAccount = query.currentAccount;
  }

  if (query.search) {
    filters.invoiceNumber = { $regex: query.search, $options: "i" };
  }

  const [items, total, summary] = await Promise.all([
    invoicePopulate(Invoice.find(filters)).skip(skip).limit(limit),
    Invoice.countDocuments(filters),
    Invoice.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          grandTotal: { $sum: "$grandTotal" },
          remainingAmount: { $sum: "$remainingAmount" },
          paidAmount: { $sum: "$paidAmount" },
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
        grandTotal: summary[0]?.grandTotal || 0,
        remainingAmount: summary[0]?.remainingAmount || 0,
        paidAmount: summary[0]?.paidAmount || 0,
      },
    },
  };
};

export const getInvoiceById = async (id) => {
  const invoice = await invoicePopulate(Invoice.findById(id));

  if (!invoice) {
    throw new ApiError(404, "Fatura bulunamadi.");
  }

  return invoice;
};

export const createInvoice = async (payload, user) => {
  const totals = calculateInvoiceTotals(payload.items);
  const invoice = await Invoice.create({
    invoiceNumber: payload.invoiceNumber.toUpperCase(),
    currentAccount: payload.currentAccount,
    issueDate: payload.issueDate,
    dueDate: payload.dueDate,
    notes: payload.notes || "",
    createdBy: user._id,
    ...totals,
    paidAmount: 0,
    remainingAmount: totals.grandTotal,
    status: "pending",
  });

  await syncCurrentBalances([invoice.currentAccount?.toString()]);

  return getInvoiceById(invoice._id);
};

export const updateInvoice = async (id, payload) => {
  const invoice = await Invoice.findById(id);

  if (!invoice) {
    throw new ApiError(404, "Fatura bulunamadi.");
  }

  const totals = payload.items ? calculateInvoiceTotals(payload.items) : null;

  if (totals && invoice.paidAmount > totals.grandTotal) {
    throw new ApiError(400, "Yeni fatura toplami, tahsil edilen tutardan dusuk olamaz.");
  }

  if (payload.invoiceNumber) {
    invoice.invoiceNumber = payload.invoiceNumber.toUpperCase();
  }

  if (payload.currentAccount) {
    invoice.currentAccount = payload.currentAccount;
  }

  if (payload.issueDate) {
    invoice.issueDate = payload.issueDate;
  }

  if (payload.dueDate) {
    invoice.dueDate = payload.dueDate;
  }

  if (payload.notes !== undefined) {
    invoice.notes = payload.notes || "";
  }

  if (totals) {
    invoice.items = totals.items;
    invoice.subtotal = totals.subtotal;
    invoice.vatTotal = totals.vatTotal;
    invoice.grandTotal = totals.grandTotal;
  }

  const financialState = deriveInvoiceFinancialState(invoice.grandTotal, invoice.paidAmount);
  invoice.remainingAmount = financialState.remainingAmount;
  invoice.status = financialState.status;

  await invoice.save();
  await syncCurrentBalances([invoice.currentAccount?.toString()]);

  return getInvoiceById(invoice._id);
};

export const recordInvoicePayment = async (id, payload, user) => {
  const invoice = await Invoice.findById(id);

  if (!invoice) {
    throw new ApiError(404, "Fatura bulunamadi.");
  }

  if (payload.amount > invoice.remainingAmount) {
    throw new ApiError(400, "Tahsilat tutari kalan tutari asamaz.");
  }

  invoice.paidAmount += payload.amount;

  const financialState = deriveInvoiceFinancialState(invoice.grandTotal, invoice.paidAmount);
  invoice.remainingAmount = financialState.remainingAmount;
  invoice.status = financialState.status;

  await invoice.save();

  await createTransaction({
    type: "invoice_payment",
    direction: "in",
    amount: payload.amount,
    date: payload.paymentDate,
    paymentMethod: payload.paymentMethod,
    accountModel: payload.accountModel,
    account: payload.account,
    currentAccount: invoice.currentAccount,
    referenceModel: "Invoice",
    referenceId: invoice._id,
    note: payload.note || `Fatura tahsilati ${invoice.invoiceNumber}`,
    createdBy: user._id,
  });

  await syncAccountBalancesForSnapshots([
    { accountModel: payload.accountModel, account: payload.account },
  ]);
  await syncCurrentBalances([invoice.currentAccount?.toString()]);

  return getInvoiceById(invoice._id);
};

export const deleteInvoice = async (id) => {
  const invoice = await Invoice.findById(id);

  if (!invoice) {
    throw new ApiError(404, "Fatura bulunamadi.");
  }

  const paymentTransactions = await import("../models/Transaction.js").then(({ Transaction }) =>
    Transaction.find({
      referenceModel: "Invoice",
      referenceId: invoice._id,
      accountModel: { $ne: null },
      account: { $ne: null },
    })
  );

  await deleteTransactionsByReference("Invoice", invoice._id);
  await invoice.deleteOne();

  await syncAccountBalancesForSnapshots(
    paymentTransactions.map((item) => ({
      accountModel: item.accountModel,
      account: item.account?.toString(),
    }))
  );
  await syncCurrentBalances([invoice.currentAccount?.toString()]);
};

