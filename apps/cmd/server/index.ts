import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { serve } from "@hono/node-server";
import { z } from "zod";
import { startChatEventPolling } from "../job/listenChatEvent";
import { logger } from "@workspace/logger";

const app = new Hono();

app.get("/hello", (c) => c.json({ greeting: "Hello Worker!" }));

app.post(
  "/echo",
  zValidator("json", z.object({ msg: z.string() })),
  (c) => c.json({ echoed: c.req.valid("json").msg }),
);

const server = serve({
  fetch: app.fetch,
  port: 8080,
}, (info) => {
  logger.info(`Server is running on port ${info.port}`);
});

startChatEventPolling().catch((err) => {
  logger.error("Chat event polling failed to start:", err);
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
