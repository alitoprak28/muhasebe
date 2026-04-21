import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination } from "../utils/queryHelpers.js";

export const listUsers = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filters = {};

  if (query.role) {
    filters.role = query.role;
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filters)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filters),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new ApiError(409, "Bu e-posta adresiyle kayitli kullanici mevcut.");
  }

  const user = await User.create(payload);

  return User.findById(user._id).select("-password");
};

export const updateUserStatus = async (id, status) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "Kullanici bulunamadi.");
  }

  user.status = status;
  await user.save();

  return User.findById(id).select("-password");
};

