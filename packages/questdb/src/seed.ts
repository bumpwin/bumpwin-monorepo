import { insertCoins, insertDominanceBatch } from "./insert";
import type { Coin } from "./models/coin";
import type { Dominance } from "./models/dominance";

// サンプルデータ生成用のヘルパー関数
function generateSampleDominance(timestamp: Date): Dominance[] {
  return [
    {
      timestamp,
      coin_id: "doge",
      dominance: 0.35,
      volume: 1000000,
    },
    {
      timestamp,
      coin_id: "pepe",
      dominance: 0.25,
      volume: 800000,
    },
    {
      timestamp,
      coin_id: "wif",
      dominance: 0.15,
      volume: 500000,
    },
    {
      timestamp,
      coin_id: "shib",
      dominance: 0.12,
      volume: 400000,
    },
    {
      timestamp,
      coin_id: "bonk",
      dominance: 0.08,
      volume: 300000,
    },
  ];
}

export const SAMPLE_COINS: Coin[] = [
  { id: "doge", name: "Dogecoin" },
  { id: "pepe", name: "Pepe" },
  { id: "wif", name: "WIF" },
  { id: "shib", name: "Shiba Inu" },
  { id: "bonk", name: "Bonk" },
];

export async function insertSampleData() {
  const now = new Date();
  await insertCoins(SAMPLE_COINS);
  const sampleData = generateSampleDominance(now);
  await insertDominanceBatch(sampleData);
  console.log("✅ サンプルデータを挿入しました");
}

insertSampleData();
