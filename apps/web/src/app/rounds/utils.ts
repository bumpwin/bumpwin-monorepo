import { DEFAULT_ICON } from "@/app/rounds/constants";
import type { ChartCoin, ChartPoint } from "@/app/rounds/types";
import type { MemeMetadata } from "@workspace/types";

export function getSafeIcon(
  coinMetadata: MemeMetadata[] | undefined,
  index: number,
): string {
  if (!coinMetadata || !coinMetadata[index]) {
    return DEFAULT_ICON;
  }
  return coinMetadata[index].iconUrl || DEFAULT_ICON;
}

export function getSafeSymbol(
  coinMetadata: MemeMetadata[] | undefined,
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
  mockCoinMetadata: MemeMetadata[] | undefined,
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
        const symbol = mockCoinMetadata?.[index]
          ? mockCoinMetadata[index].symbol.toLowerCase()
          : `coin${index}`;

        return Object.assign(acc, { [symbol]: share });
      },
      {},
    ),
  }));
}

export function getChartCoins(mockCoinMetadata: MemeMetadata[]): ChartCoin[] {
  return mockCoinMetadata.map((coin, index) => ({
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    color: `hsl(${(index * 360) / mockCoinMetadata.length}, 70%, 50%)`,
  }));
}
