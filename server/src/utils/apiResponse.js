export const sendSuccess = (
  res,
  { statusCode = 200, message = "Islem basarili.", data = null, meta = null }
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

