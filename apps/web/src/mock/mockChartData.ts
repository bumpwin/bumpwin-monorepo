export interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// ミームコイン用のデータ生成ヘルパー関数
function generateOHLCData(
  startDate: string,
  days: number,
  startPrice: number,
  volatility: number,
  trend: number,
): OHLCData[] {
  const data: OHLCData[] = [];
  const baseDate = new Date(startDate);
  let currentPrice = startPrice;

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);

    // ミームコインらしい急激な変動を加える
    const randomFactor = Math.random() * volatility;
    const trendFactor = (i / days) * trend;
    const dailyChange = randomFactor + trendFactor;

    // 特定の日に急上昇または急降下させる（ミームコインらしさを出す）
    const spikeChance = Math.random();
    const spikeMultiplier = spikeChance > 0.95 ? 3 : spikeChance > 0.9 ? 2 : 1;

    const open = currentPrice;
    const close = open * (1 + (dailyChange - volatility / 2) * spikeMultiplier);
    const high = Math.max(open, close) * (1 + Math.random() * (volatility / 2));
    const low = Math.min(open, close) * (1 - Math.random() * (volatility / 3));

    const isoString = date.toISOString();
    const dateString = isoString.split("T")[0] || isoString;

    data.push({
      time: dateString,
      open,
      high,
      low,
      close,
    });

    currentPrice = close;
  }

  return data;
}

// 各コイン用のチャートデータを生成
const elmoboniData = generateOHLCData("2023-10-01", 60, 0.000015, 0.3, 0.5);
const dogeData = generateOHLCData("2023-08-01", 90, 0.00003, 0.15, 0.1);
const pepeData = generateOHLCData("2023-09-01", 75, 0.000008, 0.25, 0.3);

// 異なるコイン用のチャートデータ
export const mockChartData: Record<string, OHLCData[]> = {
  elmobonik: elmoboniData,
  doge: dogeData,
  pepe: pepeData,
  // 数値IDでもアクセスできるようにマッピングを追加
  "1": elmoboniData,
  "2": dogeData,
  "3": pepeData,
};

// デフォルトのチャートデータ（IDがマッチしない場合用）
export const defaultChartData = generateOHLCData(
  "2023-01-01",
  30,
  0.00001,
  0.2,
  0.2,
);
