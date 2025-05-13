import { migrate } from "./migrate";
import { withConn } from "./pool";

export async function deploy() {
  try {
    // マイグレーション実行
    await migrate();
    console.log("✅ QuestDBのデプロイが完了しました");
  } catch (error) {
    console.error("❌ QuestDBのデプロイに失敗しました:", error);
    throw error;
  }
}

deploy();
