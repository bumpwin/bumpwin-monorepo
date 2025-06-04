import { COINS_TABLE, DOMINANCE_TABLE } from "./models";
import { withConn } from "./pool";

export async function migrate() {
  await withConn(async (client) => {
    await client.query(COINS_TABLE);
    await client.query(DOMINANCE_TABLE);
  });

  console.log("✅ テーブルスキーマを確認／作成しました");
}
