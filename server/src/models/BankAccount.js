import mongoose from "mongoose";
import { USER_STATUSES } from "../constants/index.js";

const bankAccountSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    accountName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    iban: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    accountNumber: {
      type: String,
      trim: true,
      default: "",
    },
    branchCode: {
      type: String,
      trim: true,
      default: "",
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "TRY",
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

