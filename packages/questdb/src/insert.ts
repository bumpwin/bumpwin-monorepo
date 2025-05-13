import type { Coin } from "./models/coin";
import type { Dominance } from "./models/dominance";
import { withConn } from "./pool";

export async function insertDominance(data: Dominance) {
  await withConn(async (client) => {
    await client.query(
      "INSERT INTO dominance (ts, coin_id, dominance, volume) VALUES ($1, $2, $3, $4)",
      [data.timestamp, data.coin_id, data.dominance, data.volume],
    );
  });
}

export async function insertDominanceBatch(data: Dominance[]) {
  await withConn(async (client) => {
    const values = data.map(
      (d) =>
        `('${d.timestamp.toISOString()}', '${d.coin_id}', ${d.dominance}, ${d.volume})`,
    );

    await client.query(
      `INSERT INTO dominance (ts, coin_id, dominance, volume) VALUES ${values.join(
        ",",
      )}`,
    );
  });
}

export async function insertCoins(data: Coin[]) {
  await withConn(async (client) => {
    const values = data.map((d) => `('${d.id}', '${d.name}')`);

    await client.query(
      `INSERT INTO coins (id, name) VALUES ${values.join(",")}`,
    );
  });
}
