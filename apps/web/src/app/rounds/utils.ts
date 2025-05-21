import { DEFAULT_ICON } from "./constants";
import type { ChartCoin, ChartPoint, CoinMetadata } from "./types";

export function getSafeIcon(
  coinMetadata: CoinMetadata[] | undefined,
  index: number,
): string {
  if (!coinMetadata || !coinMetadata[index]) {
    return DEFAULT_ICON;
  }
  return coinMetadata[index].icon || DEFAULT_ICON;
}

export function getSafeSymbol(
  coinMetadata: CoinMetadata[] | undefined,
  index: number,
): string {
  if (!coinMetadata || !coinMetadata[index]) {
    return "COIN";
  }
  return coinMetadata[index].symbol || "COIN";
}

interface DominanceDataPoint {
  timestamp: string | number;
  shares: number[];
}

export function getChartPoints(
  mockDominanceChartData: DominanceDataPoint[] | undefined,
  mockCoinMetadata: CoinMetadata[] | undefined,
  roundIndex: number,
): ChartPoint[] {
  if (!mockDominanceChartData || !mockDominanceChartData.length) {
    return [];
  }

  const offset = roundIndex * 100;
  const startIndex = offset % mockDominanceChartData.length;
  const endIndex = (startIndex + 200) % mockDominanceChartData.length;

  const dataSlice =
    endIndex > startIndex
      ? mockDominanceChartData.slice(startIndex, endIndex)
      : [
          ...mockDominanceChartData.slice(startIndex),
          ...mockDominanceChartData.slice(0, endIndex),
        ];

  return dataSlice.map((point) => ({
    timestamp: point.timestamp,
    ...(point.shares || []).reduce(
      (acc: Record<string, number>, share: number, index: number) => {
        const symbol =
          mockCoinMetadata && mockCoinMetadata[index]
            ? mockCoinMetadata[index].symbol.toLowerCase()
            : `coin${index}`;

        return Object.assign(acc, { [symbol]: share });
      },
      {},
    ),
  }));
}

export function getChartCoins(mockCoinMetadata: CoinMetadata[]): ChartCoin[] {
  return mockCoinMetadata.map((coin) => ({
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    color: coin.color,
  }));
}
