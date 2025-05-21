import {
  mockChampionCoinMetadata,
  mockCoinMetadata,
  mockDominanceChartData,
} from "@/mock/mockData";
import type { ChampionCoin } from "@/types/champion";
import type { DominanceChartData } from "@/types/dominance";
import { motion } from "framer-motion";
import Image from "next/image";
import type React from "react";
import { Globe, Send, Twitter } from "lucide-react";
import DominanceRechart from "./DominanceRechart";
import type { ChartDataPoint, PreparedCoinMeta } from "./DominanceRechart";

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
      (acc, share, index) => ({
        ...acc,
        [mockCoinMetadata[index]?.symbol.toLowerCase() || `coin${index}`]:
          share / 100,
      }),
      {},
    ),
  }));

  const chartCoins: PreparedCoinMeta[] = mockCoinMetadata.map((coin) => ({
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    color: coin.color,
  }));

  return (
    <div className="flex flex-col gap-4">
      {coins.map((coin) => {
        const metadata = mockChampionCoinMetadata.find(
          (m) => m.id.toString() === coin.id,
        );
        return (
          <div key={coin.id} className="relative">
            <div className="block group cursor-pointer" tabIndex={0}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#181A20] border border-[#23262F] rounded-2xl p-6 hover:border-yellow-400 transition-colors group-hover:shadow-lg group-active:scale-[0.98]"
              >
                <div className="flex items-start gap-6">
                  {/* Left: Coin Info */}
                  <div className="flex-1 flex items-start gap-6">
                    <div className="relative">
                      <div className="relative w-28 h-28">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-900 p-[4px] shadow-[0_0_24px_4px_rgba(255,215,0,0.25)]">
                          <div className="absolute inset-0 rounded-full bg-white p-[2px]">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-600 opacity-70" />
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                              <Image
                                src={coin.iconUrl}
                                alt={coin.name}
                                width={112}
                                height={112}
                                className="rounded-full w-full h-full object-cover border-0"
                              />
                              <div className="absolute left-2 top-2 w-2/3 h-1/4 bg-white/60 rounded-full blur-md rotate-[-20deg]" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center text-base font-bold bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 text-black shadow-xl border-2 border-white">
                          #{coin.round}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white truncate">
                          {coin.name}
                        </h3>
                        <span className="text-sm text-gray-400">
                          ({coin.symbol})
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {coin.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Market Cap:</span>
                          <span className="text-white font-medium">
                            {formatMarketCap(
                              metadata?.marketCap || coin.marketCap,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Created by:</span>
                          <span className="text-white font-medium">
                            {metadata?.createdBy || "Unknown"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-3">
                        {coin.websiteLink && (
                          <a
                            href={coin.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="w-5 h-5" />
                          </a>
                        )}
                        {coin.telegramLink && (
                          <a
                            href={coin.telegramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Send className="w-5 h-5" />
                          </a>
                        )}
                        {coin.twitterLink && (
                          <a
                            href={coin.twitterLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
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
