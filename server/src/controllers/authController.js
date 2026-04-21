import { loginUser, getProfile } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);

  return sendSuccess(res, {
    message: "Giris basarili.",
    data,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const data = await getProfile(req.user._id);

  return sendSuccess(res, {
    message: "Profil bilgileri getirildi.",
    data,
  });
});

