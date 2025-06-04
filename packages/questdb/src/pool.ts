import { Pool } from "pg";
import type { PoolClient } from "pg";
import { QUESTDB_CONFIG } from "./config";

export const pool = new Pool({
  host: QUESTDB_CONFIG.PROJECT.HOST,
  port: Number(QUESTDB_CONFIG.PROJECT.PORT),
  user: QUESTDB_CONFIG.PROJECT.USER,
  password: QUESTDB_CONFIG.PROJECT.PASSWORD,
});

export async function withConn<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
