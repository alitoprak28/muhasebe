import mongoose from "mongoose";
import { INVOICE_STATUSES } from "../constants/index.js";

const invoiceItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    vatRate: {
      type: Number,
      default: 20,
      min: 0,
      max: 100,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    vatAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    currentAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CurrentAccount",
      required: true,
      index: true,
    },
    issueDate: {
      type: Date,
      required: true,
      index: true,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: INVOICE_STATUSES,
      default: "pending",
      index: true,
    },
    items: {
      type: [invoiceItemSchema],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: "En az bir fatura kalemi gereklidir.",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    vatTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
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

invoiceSchema.index({ status: 1, dueDate: 1 });

export const Invoice = mongoose.model("Invoice", invoiceSchema);

