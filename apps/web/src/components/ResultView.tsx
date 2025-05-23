"use client";
import { useBattleClock } from "@/app/providers/BattleClockProvider";
import DominanceRechart from "@/components/DominanceRechart";
import type {
  ChartDataPoint,
  PreparedCoinMeta,
} from "@/components/DominanceRechart";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";
import type { RoundCoin } from "@/types/roundcoin";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Send, Twitter } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface ResultViewProps {
  coin: RoundCoin | undefined;
  forceVisible?: boolean;
}

export function ResultView({ coin, forceVisible = false }: ResultViewProps) {
  const { remainingTime } = useBattleClock();
  const [visible, setVisible] = useState(forceVisible);
  const prevTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Transform mockDominanceChartData to DominanceRechart format
  const chartPoints: ChartDataPoint[] = mockDominanceChartData.map((point) => ({
    timestamp: point.timestamp,
    ...point.shares.reduce(
      (acc, share, index) => {
        const symbol =
          mockCoinMetadata[index]?.symbol.toLowerCase() || `coin${index}`;
        acc[symbol] = share;
        return acc;
      },
      {} as Record<string, number>,
    ),
  }));

  const chartCoins: PreparedCoinMeta[] = mockCoinMetadata.map((coin) => ({
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    color: coin.color,
  }));

  useEffect(() => {
    if (forceVisible) {
      setVisible(true);
      return;
    }

    if (prevTimeRef.current === null) {
      prevTimeRef.current = remainingTime;
      return;
    }
    if (remainingTime === 0 && prevTimeRef.current !== 0) {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        timerRef.current = null;
      }, 5000);
    }
    prevTimeRef.current = remainingTime;
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [remainingTime, forceVisible]);

  useEffect(() => {
    if (!visible && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [visible]);

  if (!coin) return null;

  const handleClose = () => {
    if (!forceVisible) {
      setVisible(false);
    }
  };

  const handleViewMore = () => {
    if (!forceVisible) {
      setVisible(false);
    }
    router.push("/champions");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`${forceVisible ? "relative" : "fixed inset-0 z-[2000]"} flex items-center justify-center`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-8 bg-[#23262F] rounded-3xl p-12 shadow-2xl relative w-full"
            style={{
              minWidth: forceVisible ? "auto" : 480,
              maxWidth: forceVisible ? "none" : 600,
            }}
          >
            {!forceVisible && (
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold focus:outline-none"
                aria-label="Close"
                style={{ zIndex: 3100 }}
              >
                ×
              </button>
            )}
            {/* Top: Coin Info */}
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="relative">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-900 p-[4px] shadow-[0_0_24px_4px_rgba(255,215,0,0.25)]">
                    <div className="absolute inset-0 rounded-full bg-white p-[2px]">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-600 opacity-70" />
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        <Image
                          src={coin.iconUrl}
                          alt={coin.name}
                          width={128}
                          height={128}
                          className="rounded-full w-full h-full object-cover border-0"
                        />
                        <div className="absolute left-2 top-2 w-2/3 h-1/4 bg-white/60 rounded-full blur-md rotate-[-20deg]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-4xl font-extrabold text-yellow-400 flex items-center gap-4">
                {coin.name}
                <span className="text-2xl text-gray-400">({coin.symbol})</span>
              </div>
            </div>

            {/* Bottom: Metadata and Chart */}
            <div className="w-full flex justify-between items-start gap-8">
              {/* Left: Metadata */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="text-lg text-white">{coin.description}</div>
                <div className="flex gap-8 text-white text-xl font-bold">
                  <div>
                    <span className="text-yellow-300">Received Share:</span>{" "}
                    {coin.share}%
                  </div>
                  <div>
                    <span className="text-yellow-300">Market Cap:</span> $
                    {coin.marketCap.toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    {coin.telegramLink && (
                      <a
                        href={coin.telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Telegram"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </a>
                    )}
                    {coin.websiteLink && (
                      <a
                        href={coin.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Website"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {coin.twitterLink && (
                      <a
                        href={coin.twitterLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Twitter"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/trade/${coin.symbol.toLowerCase()}`)
                      }
                      className="bg-blue-400 text-white font-bold rounded-lg px-4 py-2 text-sm shadow-lg hover:bg-blue-300 transition"
                    >
                      Trade
                    </button>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="bg-yellow-400 text-[#23262F] font-bold rounded-lg px-4 py-2 text-sm shadow-lg hover:bg-yellow-300 transition"
                    >
                      Claim ${coin.symbol}
                    </button>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="bg-red-400 text-white font-bold rounded-lg px-4 py-2 text-sm shadow-lg hover:bg-red-300 transition"
                    >
                      Claim $LOSER
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Chart */}
              <div className="w-[500px]">
                <div className="h-[300px]">
                  <DominanceRechart
                    points={chartPoints}
                    coins={chartCoins}
                    height={300}
                    compact={false}
                    hideLegend={false}
                    showAllTime={true}
                  />
                </div>
              </div>
            </div>

            {!forceVisible && (
              <button
                type="button"
                onClick={handleViewMore}
                className="absolute right-8 bottom-8 bg-yellow-400 text-[#23262F] font-bold rounded-xl px-8 py-3 text-lg shadow-lg hover:bg-yellow-300 transition"
                style={{ zIndex: 3100 }}
              >
                View More
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
