import { Hono } from "hono";
import { config } from "../config";
import { handleError } from "../utils/errors";
import { logger } from "../utils/logger";

const app = new Hono();

// ミドルウェア: リクエストロギング
app.use("*", async (c, next) => {
  const start = Date.now();
  const { method, url } = c.req;

  try {
    await next();
  } finally {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method,
      url,
      duration,
      status: c.res.status,
    });
  }
});

// ミドルウェア: エラーハンドリング
app.onError((err, c) => {
  const error = handleError(err);
  logger.error("API error occurred", error, {
    path: c.req.path,
    method: c.req.method,
  });

  return c.json(
    {
      error: {
        code: error.code,
        message: error.message,
      },
    },
    error.statusCode,
  );
});

// ヘルスチェックエンドポイント
app.get("/health", (c) => {
  return c.json({
    status: "healthy",
    environment: config.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ルートエンドポイント
app.get("/", (c) => {
  return c.json({
    message: "Welcome to the API",
    version: "1.0.0",
  });
});

export default app;
