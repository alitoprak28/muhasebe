import mongoose from "mongoose";
import {
  ACCOUNT_MODELS,
  EXPENSE_CATEGORIES,
  EXPENSE_STATUSES,
  PAYMENT_METHODS,
} from "../constants/index.js";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      enum: EXPENSE_CATEGORIES,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
    currentAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CurrentAccount",
      default: null,
      index: true,
    },
    receiptNumber: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: EXPENSE_STATUSES,
      default: "paid",
      index: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrenceRule: {
      type: String,
      trim: true,
      default: "",
    },
    accountModel: {
      type: String,
      enum: ACCOUNT_MODELS,
      default: null,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "accountModel",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({ category: 1, status: 1, date: -1 });

export const Expense = mongoose.model("Expense", expenseSchema);

