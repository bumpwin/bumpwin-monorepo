import { logger } from "@workspace/logger";
import { Hono } from "hono";
import { loadInsertChatIntervalMs, loadListenChatEventPollingIntervalMs } from "../job/config";
import { startChatMessageInsertion } from "../job/insertChat";
import { startChatEventPolling } from "../job/listenChatEvent";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = 3000;

logger.info(`🚀 Server is running on port ${port}`);

// 設定の読み込み
const pollingInterval = loadListenChatEventPollingIntervalMs();
const insertInterval = loadInsertChatIntervalMs();

// 両方のポーリングプロセスを開始
Promise.all([
  startChatEventPolling(pollingInterval),
  startChatMessageInsertion(),
]).catch((error) => {
  logger.error("Failed to start polling processes:", error);
  process.exit(1);
});

export default {
  port,
  fetch: app.fetch,
};
