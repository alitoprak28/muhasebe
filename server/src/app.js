import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { notFoundHandler } from "./middlewares/notFoundMiddleware.js";
import { router } from "./routes/index.js";

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Muhasebe API ayakta.",
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    meta: null,
  });
});

app.use("/api/v1", router);
app.use(notFoundHandler);
app.use(errorHandler);

