import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "E-posta veya parola hatali.");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "E-posta veya parola hatali.");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "Kullanici pasif durumda.");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const safeUser = await User.findById(user._id).select("-password");

  return {
    user: safeUser,
    token: signToken(user),
  };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "Kullanici bulunamadi.");
  }

  return user;
};

