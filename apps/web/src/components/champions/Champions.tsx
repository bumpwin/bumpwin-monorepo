import DominanceRechart from "@/components/charts/DominanceRechart";
import type { ChartDataPoint, PreparedCoinMeta } from "@/components/charts/DominanceRechart";
import type { ChampionCoin } from "@/types/champion";
import type { DominanceChartData } from "@/types/dominance";
import { mockCoinMetadata, mockDominanceChartData } from "@workspace/mockdata";
import { motion } from "framer-motion";
import Image from "next/image";
import type React from "react";

interface ChampionsListProps {
  coins: ChampionCoin[];
  dominanceData: DominanceChartData;
}

// Format market cap to K/M/B format
const formatMarketCap = (value: number): string => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return `$${value.toFixed(1)}`;
};

export const ChampionsList: React.FC<ChampionsListProps> = ({ coins }) => {
  // Transform mockDominanceChartData to DominanceRechart format
  const chartPoints: ChartDataPoint[] = mockDominanceChartData.map((point) => ({
    timestamp: point.timestamp,
    ...point.shares.reduce(
      (acc, share, index) => {
        const symbol = mockCoinMetadata[index]?.symbol.toLowerCase() || `coin${index}`;
        acc[symbol] = share / 100;
        return acc;
      },
      {} as Record<string, number>,
    ),
  }));

  const CHART_COLORS = ["#FF69B4", "#3CB043", "#FFD700", "#00BFFF"];
  const chartCoins: PreparedCoinMeta[] = mockCoinMetadata.map((coin, index) => ({
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <div className="flex flex-col gap-4">
      {coins.map((coin) => {
        return (
          <div key={coin.id} className="relative">
            <div className="group block cursor-pointer">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-[#23262F] bg-[#181A20] p-6 transition-colors hover:border-yellow-400 group-hover:shadow-lg group-active:scale-[0.98]"
              >
                <div className="flex items-start gap-6">
                  {/* Left: Coin Info */}
                  <div className="flex flex-1 items-start gap-6">
                    <div className="relative">
                      <div className="relative h-28 w-28">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-900 p-[4px] shadow-[0_0_24px_4px_rgba(255,215,0,0.25)]">
                          <div className="absolute inset-0 rounded-full bg-white p-[2px]">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-600 opacity-70" />
                            <div className="absolute inset-0 overflow-hidden rounded-full">
                              <Image
                                src={coin.iconUrl}
                                alt={coin.name}
                                width={112}
                                height={112}
                                className="h-full w-full rounded-full border-0 object-cover"
                              />
                              <div className="absolute top-2 left-2 h-1/4 w-2/3 rotate-[-20deg] rounded-full bg-white/60 blur-md" />
                            </div>
                          </div>
                        </div>
                        <div className="-top-3 -right-3 absolute flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 font-bold text-base text-black shadow-xl">
                          #{coin.round}
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="truncate font-bold text-lg text-white">{coin.name}</h3>
                        <span className="text-gray-400 text-sm">({coin.symbol})</span>
                      </div>
                      <p className="mb-2 line-clamp-2 text-gray-400 text-sm">{coin.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Market Cap:</span>
                          <span className="font-medium text-white">
                            {formatMarketCap(coin.marketCap)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Created by:</span>
                          <span className="font-medium text-white">BUMP.WIN</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Dominance Chart */}
                  <div className="w-[400px] flex-shrink-0">
                    <div className="h-[160px]">
                      <DominanceRechart
                        points={chartPoints}
                        coins={chartCoins}
                        height={160}
                        compact={true}
                        hideLegend={true}
                        showAllTime={true}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
