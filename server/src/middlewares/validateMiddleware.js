import { ApiError } from "../utils/ApiError.js";

export const validate = (schema, source = "body") => (req, _res, next) => {
  const payload = req[source];
  const result = schema.safeParse(payload);

  if (!result.success) {
    return next(
      new ApiError(
        400,
        "Request validation hatasi.",
        result.error.errors.map((item) => ({
          path: item.path.join("."),
          message: item.message,
        }))
      )
    );
  }

  req[source] = result.data;
  return next();
};

