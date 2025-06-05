import { config } from "@/config";
import { startChatMessageInsertionAsync } from "@/jobs/insertChat";
import { startChatEventPolling } from "@/jobs/listenChatEvent";
import { logger } from "@/utils/logger";

async function startServer() {
  try {
    // バックグラウンドジョブの開始
    await Promise.all([
      startChatEventPolling(config.env.LISTEN_CHAT_EVENT_POLLING_INTERVAL_MS),
      startChatMessageInsertionAsync(),
    ]);

    logger.info("Background jobs started", {
      environment: config.env.NODE_ENV,
    });
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
