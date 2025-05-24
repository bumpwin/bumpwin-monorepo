import app from "@/api";
import { config } from "@/config";
import { startChatMessageInsertion } from "@/jobs/insertChat";
import { startChatEventPolling } from "@/jobs/listenChatEvent";
import { logger } from "@/utils/logger";
import { serve } from "@hono/node-server";

async function startServer() {
  try {
    // サーバーの起動
    serve(
      {
        fetch: app.fetch,
        port: config.env.PORT,
      },
      (info) => {
        logger.info("Server started", {
          port: info.port,
          environment: config.env.NODE_ENV,
        });
      },
    );

    // バックグラウンドジョブの開始
    await Promise.all([
      startChatEventPolling(config.env.LISTEN_CHAT_EVENT_POLLING_INTERVAL_MS),
      startChatMessageInsertion(),
    ]);
  } catch (error) {
    logger.error("Failed to start server", error as Error);
    process.exit(1);
  }
}

// グレースフルシャットダウン
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// 未処理のエラーハンドリング
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", reason as Error);
  process.exit(1);
});

// サーバーの起動
startServer();
