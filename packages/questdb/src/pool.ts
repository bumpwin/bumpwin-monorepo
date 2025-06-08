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

export async function withConn<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
