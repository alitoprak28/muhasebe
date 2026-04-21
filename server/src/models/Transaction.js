import mongoose from "mongoose";
import {
  ACCOUNT_MODELS,
  TRANSACTION_DIRECTIONS,
  TRANSACTION_TYPES,
} from "../constants/index.js";

const transactionSchema = new mongoose.Schema(
  {
    transactionNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
      index: true,
    },
    direction: {
      type: String,
      enum: TRANSACTION_DIRECTIONS,
      required: true,
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
    currentAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CurrentAccount",
      default: null,
      index: true,
    },
    referenceModel: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
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

transactionSchema.index({ accountModel: 1, account: 1, date: -1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);

