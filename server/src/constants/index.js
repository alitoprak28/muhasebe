export const ROLES = {
  ADMIN: "admin",
  ACCOUNTANT: "accountant",
  VIEWER: "viewer",
};

export const USER_STATUSES = ["active", "inactive"];

export const CURRENT_ACCOUNT_TYPES = ["customer", "supplier", "hybrid"];

export const PAYMENT_METHODS = [
  "cash",
  "bank_transfer",
  "credit_card",
  "eft",
  "check",
];

export const ACCOUNT_MODELS = ["CashAccount", "BankAccount"];

export const INCOME_CATEGORIES = [
  "product_sale",
  "service_sale",
  "consulting",
  "subscription",
  "other_income",
];

export const EXPENSE_CATEGORIES = [
  "rent",
  "salary",
  "software",
  "utilities",
  "marketing",
  "office",
  "logistics",
  "tax",
  "other_expense",
];

export const EXPENSE_STATUSES = ["paid", "pending", "scheduled"];

export const INVOICE_STATUSES = ["paid", "pending", "partial"];

export const TRANSACTION_TYPES = [
  "income",
  "expense",
  "invoice_payment",
  "transfer",
  "manual",
];

export const TRANSACTION_DIRECTIONS = ["in", "out"];

