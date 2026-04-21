import mongoose from "mongoose";
import {
  ACCOUNT_MODELS,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
} from "../constants/index.js";

const incomeSchema = new mongoose.Schema(
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
      enum: INCOME_CATEGORIES,
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
    documentNumber: {
      type: String,
      trim: true,
      default: "",
    },
    accountModel: {
      type: String,
      enum: ACCOUNT_MODELS,
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "accountModel",
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

incomeSchema.index({ category: 1, date: -1 });

export const Income = mongoose.model("Income", incomeSchema);

