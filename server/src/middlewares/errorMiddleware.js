import mongoose from "mongoose";

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Veri dogrulama hatasi.",
      data: null,
      meta: {
        details: Object.values(error.errors).map((item) => item.message),
      },
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Ayni benzersiz alan ile kayit zaten mevcut.",
      data: null,
      meta: {
        details: error.keyValue,
      },
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Beklenmeyen bir hata olustu.",
    data: null,
    meta: error.details ? { details: error.details } : null,
  });
};

