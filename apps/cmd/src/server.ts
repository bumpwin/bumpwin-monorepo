import { startChatMessageInsertion } from "@/jobs/insertChat";
import { startChatEventPollingEffect } from "@/jobs/listenChatEvent";
import { logger } from "@/utils/logger";
import { NodeFileSystem } from "@effect/platform-node";
import { loadConfig } from "@/config";
import { Effect } from "effect";

// Simple server startup - no complex Layer/Context system
const config = loadConfig();

const startServerEffect = Effect.gen(function* () {
  // Start background jobs in parallel
  yield* Effect.all(
    [
      startChatEventPollingEffect(config.env.LISTEN_CHAT_EVENT_POLLING_INTERVAL_MS),
      startChatMessageInsertion.pipe(Effect.provide(NodeFileSystem.layer)),
    ],
    { concurrency: "unbounded" },
  );

  yield* Effect.log("Background jobs started");
  yield* Effect.log(`Environment: ${config.env.NODE_ENV}`);
});

// Process signal handlers
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", reason as Error);
  process.exit(1);
});

// Simple server startup - no complex dependency injection
Effect.runPromise(
  startServerEffect.pipe(
    Effect.catchAll((error) => {
      return Effect.gen(function* () {
        yield* Effect.logError("Failed to start server");
        yield* Effect.logError(`Error: ${JSON.stringify(error, null, 2)}`);
        if (error instanceof Error) {
          yield* Effect.logError(`Error message: ${error.message}`);
          yield* Effect.logError(`Error stack: ${error.stack}`);
        }
        yield* Effect.sync(() => process.exit(1));
      });
    }),
  ),
).catch((error) => {
  logger.error("Critical server error", error);
  process.exit(1);
});