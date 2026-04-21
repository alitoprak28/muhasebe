import { ApiError } from "../utils/ApiError.js";

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route bulunamadi: ${req.originalUrl}`));
};

