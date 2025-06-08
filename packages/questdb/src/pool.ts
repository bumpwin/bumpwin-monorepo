import { Effect } from "effect";
import { Pool } from "pg";
import type { PoolClient } from "pg";
import { loadQuestDbConfig } from "./config";

const config = loadQuestDbConfig();

export const pool = new Pool({
  host: config.connection.host,
  port: config.connection.port,
  user: config.connection.user,
  password: config.connection.password,
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

/**
 * Legacy connection management (Promise-based)
 * @deprecated Use withConnEffect for new code
 */
export async function withConn<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
