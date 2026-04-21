import {
  accountModelOptions,
  currentTypeOptions,
  expenseCategoryOptions,
  expenseStatusOptions,
  incomeCategoryOptions,
  invoiceStatusOptions,
  paymentMethodOptions,
  userRoleOptions,
  userStatusOptions,
} from "../constants/options";

const optionSets = {
  income: incomeCategoryOptions,
  expense: expenseCategoryOptions,
  payment: paymentMethodOptions,
  currentType: currentTypeOptions,
  expenseStatus: expenseStatusOptions,
  invoiceStatus: invoiceStatusOptions,
  userRole: userRoleOptions,
  userStatus: userStatusOptions,
  accountModel: accountModelOptions,
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "-";

export const formatDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "-";

export const getOptionLabel = (kind, value) => {
  const list = optionSets[kind] || [];
  return list.find((item) => item.value === value)?.label || value || "-";
};

export const getAccountDisplayName = (account) => {
  if (!account) {
    return "-";
  }

  return account.name || `${account.bankName} / ${account.accountName}`;
};

