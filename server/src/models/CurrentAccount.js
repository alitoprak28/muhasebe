import mongoose from "mongoose";
import { CURRENT_ACCOUNT_TYPES, USER_STATUSES } from "../constants/index.js";

const currentAccountSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: CURRENT_ACCOUNT_TYPES,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    taxNumber: {
      type: String,
      trim: true,
      default: "",
    },
    identityNumber: {
      type: String,
      trim: true,
      default: "",
    },
    balance: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
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

currentAccountSchema.index({ type: 1, name: 1 });

export const CurrentAccount = mongoose.model(
  "CurrentAccount",
  currentAccountSchema
);

