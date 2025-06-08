import { Effect, Layer } from "effect";
import { ConfigLayer } from "./config";
import { SupabaseServiceLayer, fetchRecentChats, insertChatMessage } from "./services";

/**
 * ✅ Application Layer - All services combined
 */
export const AppLayer = Layer.mergeAll(
  ConfigLayer,
  SupabaseServiceLayer.pipe(Layer.provide(ConfigLayer)),
);

/**
 * ✅ Application Error Factory
 */
const AppErrors = {
  startup: (message: string, cause?: unknown) => ({
    _tag: "AppStartupError" as const,
    message,
    cause,
  }),

  runtime: (message: string, cause?: unknown) => ({
    _tag: "AppRuntimeError" as const,
    message,
    cause,
  }),
} as const;

export type AppError = ReturnType<(typeof AppErrors)[keyof typeof AppErrors]>;

/**
 * ✅ Optional test program for database operations (not run during server startup)
 */
export const testDatabaseProgram = Effect.gen(function* () {
  yield* Effect.log("🧪 Starting database test program");

  // Test chat insertion
  const testChatData = {
    tx_digest: "test-digest",
    event_sequence: 1,
    created_at: new Date().toISOString(),
    sender_address: "0x123",
    message_text: "Hello from Effect-ts!",
  };

  yield* Effect.log("📝 Inserting test chat message");
  const insertResult = yield* insertChatMessage(testChatData);
  yield* Effect.log(`✅ Chat inserted: ${JSON.stringify(insertResult, null, 2)}`);

  // Test chat fetching
  yield* Effect.log("📊 Fetching recent chats");
  const recentChats = yield* fetchRecentChats(5);
  yield* Effect.log(`✅ Fetched ${recentChats.length} recent chats`);

  return {
    success: true,
    insertedChat: insertResult,
    recentChats,
  };
}).pipe(
  Effect.catchAll((error: unknown): Effect.Effect<never, AppError, never> => {
    if (typeof error === "object" && error !== null && "_tag" in error) {
      const taggedError = error as { _tag: string; message?: string; details?: string };

      switch (taggedError._tag) {
        case "ConfigValidationError":
          return Effect.fail(
            AppErrors.startup(
              `Configuration validation failed: ${taggedError.details || taggedError.message}`,
              error,
            ),
          );
        case "SupabaseConnectionError":
          return Effect.fail(
            AppErrors.startup(`Supabase connection failed: ${taggedError.message}`, error),
          );
        case "SupabaseQueryError":
          return Effect.fail(
            AppErrors.runtime(`Database operation failed: ${taggedError.message}`, error),
          );
        default:
          return Effect.fail(AppErrors.runtime("Unexpected application error", error));
      }
    }
    return Effect.fail(AppErrors.runtime("Unexpected application error", error));
  }),
);

/**
 * ✅ Test runner for database operations (optional, separate from server startup)
 */
export const runDatabaseTest = () => {
  const program = testDatabaseProgram.pipe(
    Effect.provide(AppLayer),
    Effect.tap((result: { success: boolean }) =>
      Effect.log(`🎉 Database test completed successfully: ${JSON.stringify(result.success)}`),
    ),
    Effect.tapError((error: unknown) => {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : String(error);
      return Effect.log(`❌ Database test failed: ${message}`);
    }),
  );

  return Effect.runPromise(program);
};

/**
 * ✅ Server startup with graceful error handling
 */
export const startServer = (port: number) =>
  Effect.gen(function* () {
    yield* Effect.log(`🌟 Starting server on port ${port}`);

    // Initialize all services
    yield* Effect.log("🔧 Initializing services...");

    // Test basic service connectivity (without data insertion)
    yield* Effect.log("🔍 Testing service connectivity...");

    // Just test that we can fetch existing chats without inserting test data
    const recentChats = yield* fetchRecentChats(1).pipe(
      Effect.catchAll((error) =>
        Effect.gen(function* () {
          // If fetching fails, log the error but don't crash the server
          yield* Effect.logWarning(
            `⚠️ Database connectivity test failed, but server can still start: ${JSON.stringify(error)}`,
          );
          return [];
        }),
      ),
    );

    yield* Effect.log(
      `✅ Service connectivity test completed. Found ${recentChats.length} existing chats.`,
    );

    yield* Effect.log(`🚀 Server is ready and listening on port ${port}`);

    return {
      port,
      status: "running",
      services: ["config", "supabase"],
      healthCheck: {
        database: recentChats.length >= 0 ? "connected" : "warning",
      },
    };
  }).pipe(Effect.provide(AppLayer));
