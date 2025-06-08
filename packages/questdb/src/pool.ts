import { Context, Effect, Layer } from "effect";
import { Pool } from "pg";
import type { PoolClient } from "pg";
import { type QuestDbConfig, QuestDbConfigContext } from "./config";

// ✅ Effect-based pool creation
const createPoolEffect = Effect.gen(function* () {
  const configService = yield* QuestDbConfigContext;
  const config = configService.config;

  return new Pool({
    host: config.connection.host,
    port: config.connection.port,
    user: config.connection.user,
    password: config.connection.password,
  });
});

// ✅ Pool service for dependency injection
export interface PoolService {
  readonly pool: Pool;
}

export const PoolService = Context.GenericTag<PoolService>("PoolService");

export const PoolServiceLayer = Layer.effect(
  PoolService,
  Effect.gen(function* () {
    const pool = yield* createPoolEffect;
    return { pool };
  }),
);

// ✅ Legacy pool for backward compatibility (temporary)
// TODO: Migrate all usage to PoolService and remove this
const tempConfig: QuestDbConfig = {
  env: {
    QDB_HOST: process.env.QDB_HOST || "localhost",
    QDB_PG_PORT: Number(process.env.QDB_PG_PORT) || 8812,
    QDB_USER: process.env.QDB_USER || "admin",
    QDB_PASSWORD: process.env.QDB_PASSWORD || "quest",
  },
  connection: {
    host: process.env.QDB_HOST || "localhost",
    port: Number(process.env.QDB_PG_PORT) || 8812,
    user: process.env.QDB_USER || "admin",
    password: process.env.QDB_PASSWORD || "quest",
  },
};

export const pool = new Pool({
  host: tempConfig.connection.host,
  port: tempConfig.connection.port,
  user: tempConfig.connection.user,
  password: tempConfig.connection.password,
});

/**
 * Effect-based connection management with automatic resource cleanup
 * ✅ Preferred - Uses Effect.acquireUseRelease for safe resource management
 */
export const withConnEffect = <T>(
  fn: (client: PoolClient) => Effect.Effect<T, unknown>,
): Effect.Effect<T, unknown> =>
  Effect.acquireUseRelease(
    // Acquire: Get connection from pool
    Effect.tryPromise({
      try: () => pool.connect(),
      catch: (error) => ({
        type: "connection_error",
        message: "Failed to get connection",
        cause: error,
      }),
    }),
    // Use: Execute the function with the client
    (client) => fn(client),
    // Release: Always release the connection back to pool
    (client) => Effect.sync(() => client.release()),
  );
