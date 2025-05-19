import { Hono } from 'hono';
import { handle } from 'hono/vercel';

// Mock price data generation function
const generateMockPriceData = (
  seed: string,
  freq: "day" | "min" = "day",
  count: number = 30
): { timestamp: number; value: number }[] => {
  const data = new Array<{ timestamp: number; value: number }>(count);
  const now = Date.now();
  const baseValue = 100 + Number.parseInt(seed) * 20;
  let value = baseValue;
  const trend = Number.parseInt(seed) % 3 === 0 ? 2 : Number.parseInt(seed) % 3 === 1 ? 0.5 : -1;

  // 間隔を設定: 日足ならば1日、分足ならば1分
  const interval = freq === "min" ? 60 * 1000 : 24 * 60 * 60 * 1000;

  // 変動性: 分足のほうが日足より変動が小さい
  const volatility = freq === "min" ? 5 : 15;

  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - 1 - i) * interval;
    value = value + trend + (Math.random() - 0.5) * volatility;
    data[i] = {
      timestamp,
      value: Math.max(10, value)
    };
  }
  return data;
}

// Create Hono app
const app = new Hono()

// Define mockprice endpoint
app.get('/', (c) => {
  const seed = c.req.query('seed') || '0';
  const freq = (c.req.query('freq') || 'day') as 'day' | 'min';
  const count = Number(c.req.query('count') || 30);

  // バリデーション
  if (freq !== 'day' && freq !== 'min') {
    return c.json({ error: 'freq must be "day" or "min"' }, 400);
  }

  if (Number.isNaN(count) || count <= 0 || count > 1000) {
    return c.json({ error: 'count must be a number between 1 and 1000' }, 400);
  }

  const data = generateMockPriceData(seed, freq, count);
  return c.json({ data });
})

// Export Edge Runtime configuration
export const config = {
  runtime: 'edge',
}

// Export handler
export default handle(app);