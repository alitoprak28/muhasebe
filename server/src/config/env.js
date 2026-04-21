import dotenv from "dotenv";

dotenv.config();

const requiredVariables = ["MONGO_URI", "JWT_SECRET"];

requiredVariables.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Required environment variable missing: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

