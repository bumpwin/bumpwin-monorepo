"use client";
import { useBattleClock } from "@/providers/BattleClockProvider";
import type { CoinCardProps } from "@/types/coincard";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface ResultViewProps {
  coin: CoinCardProps | undefined;
  forceVisible?: boolean;
}

export function ResultView({ coin, forceVisible = false }: ResultViewProps) {
  const { remainingTime } = useBattleClock();
  const [visible, setVisible] = useState(forceVisible);
  const prevTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
                          src={coin.logoUrl}
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
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
