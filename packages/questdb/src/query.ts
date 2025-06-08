import { Effect } from "effect";
import type { Coin, Dominance } from "./models";
import { withConnEffect } from "./pool";

// ✅ Effect-based query functions

// 最新のドミナンスデータを取得
export const getLatestDominanceEffect = withConnEffect((client) =>
  Effect.gen(function* () {
    const result = yield* Effect.tryPromise(() =>
      client.query(`
        SELECT
          ts as timestamp,
          coin_id,
          dominance,
          volume
        FROM dominance
        LATEST ON ts PARTITION BY coin_id
        ORDER BY ts DESC
      `),
    );
    return result.rows as Dominance[];
  }),
);

// 指定期間のドミナンスデータを取得
export const getDominanceByPeriodEffect = (startTime: Date, endTime: Date, interval = "1h") =>
  withConnEffect((client) =>
    Effect.gen(function* () {
      const result = yield* Effect.tryPromise(() =>
        client.query(
          `
          SELECT
            ts as timestamp,
            coin_id,
            avg(dominance) as dominance,
            sum(volume) as volume
          FROM dominance
          WHERE ts BETWEEN $1 AND $2
          SAMPLE BY $3
          ORDER BY ts ASC
        `,
          [startTime, endTime, interval],
        ),
      );
      return result.rows as Dominance[];
    }),
  );

// コイン一覧を取得
export const getCoinsEffect = withConnEffect((client) =>
  Effect.gen(function* () {
    const result = yield* Effect.tryPromise(() =>
      client.query(`
        SELECT id, name
        FROM coins
        ORDER BY id ASC
      `),
    );
    return result.rows as Coin[];
  }),
);

// 特定のコインのドミナンス履歴を取得
export const getCoinDominanceHistoryEffect = (
  coinId: string,
  startTime: Date,
  endTime: Date,
  interval = "1h",
) =>
  withConnEffect((client) =>
    Effect.gen(function* () {
      const result = yield* Effect.tryPromise(() =>
        client.query(
          `
          SELECT
            ts as timestamp,
            coin_id,
            avg(dominance) as dominance,
            sum(volume) as volume
          FROM dominance
          WHERE coin_id = $1
            AND ts BETWEEN $2 AND $3
          SAMPLE BY $4
          ORDER BY ts ASC
        `,
          [coinId, startTime, endTime, interval],
        ),
      );
      return result.rows as Dominance[];
    }),
  );

// ✅ Legacy Promise-based functions (backward compatibility)
// TODO: Migrate callers to Effect versions and remove these

// 最新のドミナンスデータを取得
export async function getLatestDominance(): Promise<Dominance[]> {
  return await Effect.runPromise(getLatestDominanceEffect);
}

// 指定期間のドミナンスデータを取得
export async function getDominanceByPeriod(
  startTime: Date,
  endTime: Date,
  interval = "1h",
): Promise<Dominance[]> {
  return await Effect.runPromise(getDominanceByPeriodEffect(startTime, endTime, interval));
}

// コイン一覧を取得
export async function getCoins(): Promise<Coin[]> {
  return await Effect.runPromise(getCoinsEffect);
}

// 特定のコインのドミナンス履歴を取得
export async function getCoinDominanceHistory(
  coinId: string,
  startTime: Date,
  endTime: Date,
  interval = "1h",
): Promise<Dominance[]> {
  return await Effect.runPromise(
    getCoinDominanceHistoryEffect(coinId, startTime, endTime, interval),
  );
}
