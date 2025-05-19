import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const querySchema = z.object({
  seed: z.string().default("0"),
  freq: z.enum(["day", "min"]).default("day"),
  count: z.string().transform(Number).refine(val => !Number.isNaN(val) && val > 0 && val <= 1000, {
    message: "count must be a number between 1 and 1000",
  }).default("30"),
});

// Mock price data generation function - オリジナルのロジックを踏襲
const generateMockPriceData = (
  seed: string,
  freq: "day" | "min" = "day",
  count = 30
) => {
  const data = [];
  const now = Date.now();

  // コインIDによって初期値を変える (オリジナルのgenerateOHLCDataと同様)
  const seedNum = Number.parseInt(seed) || 0;
  const baseValue = 0.0001 + (seedNum % 3) * 0.0002;
  let price = baseValue;

  // 時間間隔を設定
  const interval = freq === "min" ? 60 * 1000 : 24 * 60 * 60 * 1000;

  // 変動性: 分足のほうが日足より変動が小さい
  const volatility = freq === "min" ? 0.02 : 0.05; // 2%か5%の変動

  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - 1 - i) * interval;
    
    // 前日の価格を基準に変動を生成 (オリジナルと同様)
    const changePercent = (Math.random() - 0.5) * volatility * 2; // -5%から+5%
    
    const open = price;
    const close = open * (1 + changePercent);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02); // 最大2%高い
    const low = Math.min(open, close) * (1 - Math.random() * 0.02); // 最大2%低い

    data.push({
      timestamp,
      // APIレスポンスには4つの価格すべてを含める
      open,
      high,
      low,
      close
    });

    // 次の日の始値は前日の終値 (オリジナルと同様)
    price = close;
  }

  return data;
}

export const app = new Hono()
  .get("/", zValidator("query", querySchema), (c) => {
    const { seed, freq, count } = c.req.valid("query");
    const data = generateMockPriceData(seed, freq, count);
    return c.json({ data });
  });