import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

const extractToken = (req) => {
  const authorization = req.headers.authorization || "";

  if (authorization.startsWith("Bearer ")) {
    return authorization.split(" ")[1];
  }

  return null;
};

export const protect = async (req, _res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new ApiError(401, "Yetkilendirme tokeni bulunamadi."));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.status !== "active") {
      return next(new ApiError(401, "Kullanici aktif degil veya bulunamadi."));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new ApiError(401, "Gecersiz veya suresi dolmus token."));
  }
};

export const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, "Bu islem icin yetkiniz bulunmuyor."));
  }

  return next();
};

