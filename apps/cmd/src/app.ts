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
 * ✅ Sample application program using all services
 */
export const sampleProgram = Effect.gen(function* () {
  yield* Effect.log("🚀 Starting sample application program");

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
 * ✅ Application runner with comprehensive error handling
 */
export const runApplication = () => {
  const program = sampleProgram.pipe(
    Effect.provide(AppLayer),
    Effect.tap((result: { success: boolean }) =>
      Effect.log(`🎉 Application completed successfully: ${JSON.stringify(result.success)}`),
    ),
    Effect.tapError((error: unknown) => {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : String(error);
      return Effect.log(`❌ Application failed: ${message}`);
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

    // Run sample program to test all integrations
    const testResult = yield* sampleProgram;
    yield* Effect.log(
      `✅ Service integration test completed: ${JSON.stringify(testResult.success)}`,
    );

    yield* Effect.log(`🚀 Server is ready and listening on port ${port}`);

    return {
      port,
      status: "running",
      services: ["config", "supabase"],
      testResult,
    };
  }).pipe(Effect.provide(AppLayer));
