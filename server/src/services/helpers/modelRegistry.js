import { BankAccount } from "../../models/BankAccount.js";
import { CashAccount } from "../../models/CashAccount.js";
import { ApiError } from "../../utils/ApiError.js";

export const accountModelRegistry = {
  CashAccount,
  BankAccount,
};

export const resolveAccountModel = (modelName) => {
  const model = accountModelRegistry[modelName];

  if (!model) {
    throw new ApiError(400, "Gecersiz hesap modeli.");
  }

  return model;
};

