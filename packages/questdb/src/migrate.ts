import { COINS_TABLE } from "./models/coin";
import { DOMINANCE_TABLE } from "./models/dominance";
import { withConn } from "./pool";

export async function migrate() {
  await withConn(async (client) => {
    await client.query(COINS_TABLE);
    await client.query(DOMINANCE_TABLE);
  });

  console.log("✅ テーブルスキーマを確認／作成しました");
}
