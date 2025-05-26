export interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function generateMockPriceData(
  seed: string,
  freq: "day" | "min" = "day",
  count = 30,
): PriceData[] {
  const data: PriceData[] = [];
  const now = Date.now();

  const seedNum = Number.parseInt(seed) || 0;
  const baseValue = 0.0001 + (seedNum % 3) * 0.0002;
  let price = baseValue;

  const interval = freq === "min" ? 60 * 1000 : 24 * 60 * 60 * 1000;
  const volatility = freq === "min" ? 0.02 : 0.05;

  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - 1 - i) * interval;
    const changePercent = (Math.random() - 0.5) * volatility * 2;

    const open = price;
    const close = open * (1 + changePercent);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);

    data.push({
      timestamp,
      open,
      high,
      low,
      close,
    });

    price = close;
  }

  return data;
}
