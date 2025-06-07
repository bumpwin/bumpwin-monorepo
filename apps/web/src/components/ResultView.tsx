"use client";
import DominanceRechart from "@/components/charts/DominanceRechart";
import type { ChartDataPoint, PreparedCoinMeta } from "@/components/charts/DominanceRechart";
import { useBattleClock } from "@/providers/BattleClockProvider";
import type { UIRoundCoinData } from "@/types/ui-types";
import { getColorByIndex } from "@/utils/colors";
import { mockCoinMetadata, mockDominanceChartData } from "@workspace/mockdata";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ResultViewProps {
  coin: UIRoundCoinData | undefined;
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
        const symbol = mockCoinMetadata[index]?.symbol.toLowerCase() || `coin${index}`;
        acc[symbol] = share;
        return acc;
      },
      {} as Record<string, number>,
    ),
  }));

  const chartCoins: PreparedCoinMeta[] = mockCoinMetadata.map((coin, index) => ({
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    color: getColorByIndex(index),
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
            className="relative flex w-full flex-col items-center gap-8 rounded-3xl bg-[#23262F] p-12 shadow-2xl"
            style={{
              minWidth: forceVisible ? "auto" : 480,
              maxWidth: forceVisible ? "none" : 600,
            }}
          >
            {!forceVisible && (
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 font-bold text-3xl text-gray-400 hover:text-white focus:outline-none"
                aria-label="Close"
                style={{ zIndex: 3100 }}
              >
                ×
              </button>
            )}
            {/* Top: Coin Info */}
            <div className="flex w-full flex-col items-center gap-6">
              <div className="relative">
                <div className="relative h-32 w-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-900 p-[4px] shadow-[0_0_24px_4px_rgba(255,215,0,0.25)]">
                    <div className="absolute inset-0 rounded-full bg-white p-[2px]">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-600 opacity-70" />
                      <div className="absolute inset-0 overflow-hidden rounded-full">
                        <Image
                          src={coin.iconUrl}
                          alt={coin.name}
                          width={128}
                          height={128}
                          className="h-full w-full rounded-full border-0 object-cover"
                        />
                        <div className="absolute top-2 left-2 h-1/4 w-2/3 rotate-[-20deg] rounded-full bg-white/60 blur-md" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 font-extrabold text-4xl text-yellow-400">
                {coin.name}
                <span className="text-2xl text-gray-400">({coin.symbol})</span>
              </div>
            </div>

            {/* Bottom: Metadata and Chart */}
            <div className="flex w-full items-start justify-between gap-8">
              {/* Left: Metadata */}
              <div className="flex flex-1 flex-col gap-6">
                <div className="text-lg text-white">{coin.description}</div>
                <div className="flex gap-8 font-bold text-white text-xl">
                  <div>
                    <span className="text-yellow-300">Received Share:</span> {coin.share}%
                  </div>
                  <div>
                    <span className="text-yellow-300">Market Cap:</span> $
                    {coin.marketCap.toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => router.push(`/trade/${coin.symbol.toLowerCase()}`)}
                      className="rounded-lg bg-blue-400 px-4 py-2 font-bold text-sm text-white shadow-lg transition hover:bg-blue-300"
                    >
                      Trade
                    </button>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="rounded-lg bg-yellow-400 px-4 py-2 font-bold text-[#23262F] text-sm shadow-lg transition hover:bg-yellow-300"
                    >
                      Claim ${coin.symbol}
                    </button>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="rounded-lg bg-red-400 px-4 py-2 font-bold text-sm text-white shadow-lg transition hover:bg-red-300"
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
                className="absolute right-8 bottom-8 rounded-xl bg-yellow-400 px-8 py-3 font-bold text-[#23262F] text-lg shadow-lg transition hover:bg-yellow-300"
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
