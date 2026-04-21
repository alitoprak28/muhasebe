import mongoose from "mongoose";
import { USER_STATUSES } from "../constants/index.js";

const cashAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    currency: {
      type: String,
      default: "TRY",
      trim: true,
      uppercase: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    description: {
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

export const CashAccount = mongoose.model("CashAccount", cashAccountSchema);

