import { config } from "@/config";
import { handleError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import { Hono } from "hono";
import battles from "./battles";
import champions from "./champions";
import rounds from "./rounds";

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

  return c.json({
    error: {
      code: error.code,
      message: error.message,
    },
  });
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

// Mount sub-routes
app.route("/battles", battles);
app.route("/champions", champions);
app.route("/rounds", rounds);

export default app;
