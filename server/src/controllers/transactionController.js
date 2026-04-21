import { listTransactions } from "../services/transactionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getTransactions = asyncHandler(async (req, res) => {
  const { items, meta } = await listTransactions(req.query);

  return sendSuccess(res, {
    message: "Finansal hareketler listelendi.",
    data: items,
    meta,
  });
});

