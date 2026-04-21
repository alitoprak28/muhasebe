import { getDashboardOverview } from "../services/dashboardService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getDashboard = asyncHandler(async (_req, res) => {
  const data = await getDashboardOverview();

  return sendSuccess(res, {
    message: "Dashboard verileri getirildi.",
    data,
  });
});

