import type { Coin } from "./models/coin";
import type { Dominance } from "./models/dominance";
import { withConn } from "./pool";

// 最新のドミナンスデータを取得
export async function getLatestDominance(): Promise<Dominance[]> {
  return await withConn(async (client) => {
    const result = await client.query(`
      SELECT
        ts as timestamp,
        coin_id,
        dominance,
        volume
      FROM dominance
      LATEST ON ts PARTITION BY coin_id
      ORDER BY ts DESC
    `);
    return result.rows;
  });
}

// 指定期間のドミナンスデータを取得
export async function getDominanceByPeriod(
  startTime: Date,
  endTime: Date,
  interval = "1h",
): Promise<Dominance[]> {
  return await withConn(async (client) => {
    const result = await client.query(
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
    );
    return result.rows;
  });
}

// コイン一覧を取得
export async function getCoins(): Promise<Coin[]> {
  return await withConn(async (client) => {
    const result = await client.query(`
      SELECT id, name
      FROM coins
      ORDER BY id ASC
    `);
    return result.rows;
  });
}

// 特定のコインのドミナンス履歴を取得
export async function getCoinDominanceHistory(
  coinId: string,
  startTime: Date,
  endTime: Date,
  interval = "1h",
): Promise<Dominance[]> {
  return await withConn(async (client) => {
    const result = await client.query(
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
    );
    return result.rows;
  });
}

getCoins().then((coins) => {
  console.log(coins);
});
