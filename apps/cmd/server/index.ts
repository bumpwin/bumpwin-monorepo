import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { logger } from "@workspace/logger";
import {
  insertChatIntervalMs,
  listenChatEventPollingIntervalMs,
} from "../job/config";
import { Hono } from "hono";
import { z } from "zod";
import { startChatMessageInsertion } from "../job/insertChat";
import { startChatEventPolling } from "../job/listenChatEvent";

const app = new Hono();

app.get("/hello", (c) => c.json({ greeting: "Hello Worker!" }));

app.post("/echo", zValidator("json", z.object({ msg: z.string() })), (c) =>
  c.json({ echoed: c.req.valid("json").msg }),
);

const server = serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    logger.info(`Server is running on port ${info.port}`);
  },
);

// Start both polling processes
Promise.all([
  startChatEventPolling(listenChatEventPollingIntervalMs),
  startChatMessageInsertion(insertChatIntervalMs),
]).catch((err) => {
  logger.error("Failed to start polling processes:", err);
  process.exit(1);
});

process.on("SIGINT", () => {
  logger.info("Received SIGINT. Shutting down...");
  server.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM. Shutting down...");
  server.close();
  process.exit(0);
});
