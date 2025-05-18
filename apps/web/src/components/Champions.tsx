import React from "react";
import type { ChampionCoin } from "../types/champion";
import type { DominanceChartData } from "../types/dominance";
import DominanceRechart from "./DominanceRechart";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ChartDataPoint, PreparedCoinMeta } from "./DominanceRechart";
import {
  mockCoinMetadata,
  mockDominanceChartData,
  mockChampionCoinMetadata,
} from "../mock/mockData";

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
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
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
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.75 3.12-1.36 5.2-2.26 6.24-2.7 2.98-1.24 3.6-1.46 4.01-1.46.09 0 .29.02.42.12.11.08.14.19.16.27.02.06.01.24-.01.38z" />
                            </svg>
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
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                            </svg>
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
