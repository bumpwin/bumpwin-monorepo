import { Effect } from "effect";
import type { Coin, Dominance } from "./models";
import { withConnEffect } from "./pool";

// ✅ Effect-based insert functions
export const insertDominanceEffect = (data: Dominance) =>
  withConnEffect((client) =>
    Effect.tryPromise(() =>
      client.query(
        "INSERT INTO dominance (ts, coin_id, dominance, volume) VALUES ($1, $2, $3, $4)",
        [data.timestamp, data.coin_id, data.dominance, data.volume],
      ),
    ),
  );

export const insertDominanceBatchEffect = (data: Dominance[]) =>
  withConnEffect((client) =>
    Effect.gen(function* () {
      const values = data.map(
        (d) => `('${d.timestamp.toISOString()}', '${d.coin_id}', ${d.dominance}, ${d.volume})`,
      );

      yield* Effect.tryPromise(() =>
        client.query(
          `INSERT INTO dominance (ts, coin_id, dominance, volume) VALUES ${values.join(",")}`,
        ),
      );
    }),
  );

export const insertCoinsEffect = (data: Coin[]) =>
  withConnEffect((client) =>
    Effect.gen(function* () {
      const values = data.map((d) => `('${d.id}', '${d.name}')`);

      yield* Effect.tryPromise(() =>
        client.query(`INSERT INTO coins (id, name) VALUES ${values.join(",")}`),
      );
    }),
  );

// ✅ Legacy Promise-based functions (backward compatibility)
// TODO: Migrate callers to Effect versions and remove these
export async function insertDominance(data: Dominance) {
  const result = await Effect.runPromise(insertDominanceEffect(data));
  return result;
}

export async function insertDominanceBatch(data: Dominance[]) {
  const result = await Effect.runPromise(insertDominanceBatchEffect(data));
  return result;
}

export async function insertCoins(data: Coin[]) {
  const result = await Effect.runPromise(insertCoinsEffect(data));
  return result;
}
