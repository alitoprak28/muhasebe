import {
  createUser,
  listUsers,
  updateUserStatus,
} from "../services/userService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getUsers = asyncHandler(async (req, res) => {
  const { items, meta } = await listUsers(req.query);

  return sendSuccess(res, {
    message: "Kullanicilar listelendi.",
    data: items,
    meta,
  });
});

export const postUser = asyncHandler(async (req, res) => {
  const data = await createUser(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Kullanici olusturuldu.",
    data,
  });
});

export const patchUserStatus = asyncHandler(async (req, res) => {
  const data = await updateUserStatus(req.params.id, req.body.status);

  return sendSuccess(res, {
    message: "Kullanici durumu guncellendi.",
    data,
  });
});

