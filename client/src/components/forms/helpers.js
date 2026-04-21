export const toDateInputValue = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
};

export const accountOptionsByModel = (model, cashAccounts, bankAccounts) => {
  if (model === "CashAccount") {
    return cashAccounts.map((item) => ({ value: item._id, label: `${item.name} (${item.code})` }));
  }

  if (model === "BankAccount") {
    return bankAccounts.map((item) => ({
      value: item._id,
      label: `${item.bankName} / ${item.accountName}`,
    }));
  }

  return [];
};

