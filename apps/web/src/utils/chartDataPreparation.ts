import {
  ChartDataPoint,
  CoinMeta,
  PreparedCoinMeta,
} from "@/components/DominanceRechart";

const DEFAULT_COLOR_PALETTE = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#c300ff",
  "#00c3ff",
];

/**
 * コインメタデータからチャート用に処理されたコインメタデータを取得します
 */
export function prepareCoinsMetadata(
  coinMetadata: CoinMeta[],
  numberOfCoinsToDisplay: number = 4,
  colorPalette: string[] = DEFAULT_COLOR_PALETTE,
): PreparedCoinMeta[] {
  return coinMetadata.slice(0, numberOfCoinsToDisplay).map((coin, index) => ({
    symbol: coin.symbol,
    name: coin.symbol,
    color: coin.color || colorPalette[index % colorPalette.length]!,
  }));
}

/**
 * 全コイン用のチャートデータポイントを作成します
 */
export function prepareMultiCoinChartData(
  dominanceData: { timestamp: number; shares: number[] }[],
  relevantCoins: PreparedCoinMeta[],
): ChartDataPoint[] {
  return dominanceData.map((item) => {
    const point: ChartDataPoint = { timestamp: item.timestamp };
    (item.shares || []).forEach((share, index) => {
      if (index < relevantCoins.length) {
        const currentCoin = relevantCoins[index];
        if (currentCoin) {
          point[currentCoin.symbol] = share;
        }
      }
    });
    return point;
  });
}

/**
 * 単一コイン用のチャートデータポイントを作成します
 */
export function prepareSingleCoinChartData(
  dominanceData: { timestamp: number; shares: number[] }[],
  coinMeta: PreparedCoinMeta | undefined,
): ChartDataPoint[] {
  return dominanceData.map((item) => {
    const point: ChartDataPoint = { timestamp: item.timestamp };
    if (coinMeta && item.shares && item.shares.length > 0) {
      point[coinMeta.symbol] = item.shares[0] ?? 0;
    }
    return point;
  });
}
