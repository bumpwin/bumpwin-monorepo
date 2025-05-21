"use client";
import { useBattleClock } from "@/app/providers/BattleClockProvider";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";
import type { RoundCoin } from "@/types/roundcoin";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import DominanceRechart from "./DominanceRechart";
import type { ChartDataPoint, PreparedCoinMeta } from "./DominanceRechart";

interface ResultViewProps {
  coin: RoundCoin | undefined;
  forceVisible?: boolean;
}

export function ResultView({ coin, forceVisible = false }: ResultViewProps) {
  const { remainingTime, totalTime } = useBattleClock();
  const [visible, setVisible] = useState(forceVisible);
  const prevTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Transform mockDominanceChartData to DominanceRechart format
  const chartPoints: ChartDataPoint[] = mockDominanceChartData.map((point) => ({
    timestamp: point.timestamp,
    ...point.shares.reduce(
      (acc, share, index) => ({
        ...acc,
        [mockCoinMetadata[index]?.symbol.toLowerCase() || `coin${index}`]:
          share,
      }),
      {},
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
  }, [remainingTime, totalTime, forceVisible]);

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
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.75 3.12-1.36 5.2-2.26 6.24-2.7 2.98-1.24 3.6-1.46 4.01-1.46.09 0 .29.02.42.12.11.08.14.19.16.27.02.06.01.24-.01.38z" />
                        </svg>
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
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
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
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        router.push(`/trade/${coin.symbol.toLowerCase()}`)
                      }
                      className="bg-blue-400 text-white font-bold rounded-lg px-4 py-2 text-sm shadow-lg hover:bg-blue-300 transition"
                    >
                      Trade
                    </button>
                    <button
                      onClick={() => {}}
                      className="bg-yellow-400 text-[#23262F] font-bold rounded-lg px-4 py-2 text-sm shadow-lg hover:bg-yellow-300 transition"
                    >
                      Claim ${coin.symbol}
                    </button>
                    <button
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
