import { Effect } from "effect";
import { AppLayer, startServer } from "./app";
import { getConfig } from "./config";

/**
 * ✅ Effect-ts compliant server startup
 */
const serverEffect = Effect.gen(function* () {
  const config = yield* getConfig;
  const result = yield* startServer(config.env.PORT);

  yield* Effect.log("✅ Server startup completed successfully");
  yield* Effect.log(`🔧 Services initialized: ${result.services.join(", ")}`);
  yield* Effect.log(`🌐 Server listening on http://localhost:${result.port}`);

  // Keep the process alive
  yield* Effect.never; // This will run indefinitely
}).pipe(Effect.provide(AppLayer));

/**
 * ✅ Graceful shutdown handlers
 */
const setupGracefulShutdown = () => {
  const shutdown = (signal: string) => {
    Effect.runSync(Effect.log(`${signal} received, shutting down gracefully`));
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("uncaughtException", (error) => {
    Effect.runSync(Effect.logError(`Uncaught exception: ${error.message}`));
    console.error(error);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    Effect.runSync(Effect.logError(`Unhandled rejection: ${String(reason)}`));
    console.error(reason);
    process.exit(1);
  });
};

/**
 * ✅ Start the application
 */
const main = () => {
  setupGracefulShutdown();

  Effect.runPromise(
    serverEffect.pipe(
      Effect.catchAll((error: unknown) =>
        Effect.gen(function* () {
          if (typeof error === "object" && error !== null && "_tag" in error) {
            const taggedError = error as { _tag: string; message?: string; details?: string };

            switch (taggedError._tag) {
              case "ConfigValidationError":
                yield* Effect.logError("❌ Configuration validation failed");
                yield* Effect.logError(`Details: ${taggedError.details || taggedError.message}`);
                break;
              case "SupabaseConnectionError":
                yield* Effect.logError("❌ Supabase connection failed");
                yield* Effect.logError(`Error: ${taggedError.message}`);
                break;
              case "AppStartupError":
                yield* Effect.logError("❌ Application startup failed");
                yield* Effect.logError(`Error: ${taggedError.message}`);
                break;
              default:
                yield* Effect.logError("❌ Unexpected server error");
                yield* Effect.logError(`Error: ${JSON.stringify(error, null, 2)}`);
                break;
            }
          } else {
            yield* Effect.logError("❌ Unexpected server error");
            yield* Effect.logError(`Error: ${String(error)}`);
          }
          yield* Effect.sync(() => process.exit(1));
        }),
      ),
    ),
  ).catch((error) => {
    console.error("💥 Critical server error:", error);
    process.exit(1);
  });
};

// Start the application
main();
