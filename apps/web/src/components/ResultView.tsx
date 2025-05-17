"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBattleClock } from "@/app/providers/BattleClockProvider";
import type { RoundCoin } from "@/types/roundcoin";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ResultView({ coin }: { coin: RoundCoin | undefined }) {
  const { remainingTime, totalTime } = useBattleClock();
  const [visible, setVisible] = useState(false);
  const prevTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
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
  }, [remainingTime, totalTime]);

  useEffect(() => {
    if (!visible && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [visible]);

  if (!coin) return null;

  const handleClose = () => {
    setVisible(false);
  };

  const handleViewMore = () => {
    setVisible(false);
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
          className="fixed inset-0 z-[2000] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-8 bg-[#23262F] rounded-3xl p-12 shadow-2xl relative"
            style={{
              minWidth: 480,
              maxWidth: 600,
            }}
          >
            {/* カード内右上に×ボタン */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold focus:outline-none"
              aria-label="Close"
              style={{ zIndex: 3100 }}
            >
              ×
            </button>
            <Image
              src={coin.iconUrl}
              alt={coin.name}
              width={120}
              height={120}
              className="rounded-2xl border-4 border-yellow-400 bg-white"
            />
            <div className="text-4xl font-extrabold text-yellow-400 flex items-center gap-4">
              {coin.name}
              <span className="text-2xl text-gray-400">({coin.symbol})</span>
            </div>
            <div className="text-lg text-white text-center max-w-xl">
              {coin.description}
            </div>
            <div className="flex gap-8 text-white text-xl font-bold">
              <div>
                <span className="text-yellow-300">Share:</span>{" "}
                {(coin.share * 100).toFixed(1)}%
              </div>
              <div>
                <span className="text-yellow-300">Market Cap:</span> $
                {coin.marketCap.toLocaleString()}
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              {coin.telegramLink && (
                <a
                  href={coin.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Telegram"
                >
                  <img
                    src="/icons/telegram.svg"
                    alt="Telegram"
                    width={32}
                    height={32}
                  />
                </a>
              )}
              {coin.websiteLink && (
                <a
                  href={coin.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Website"
                >
                  <img
                    src="/icons/link.svg"
                    alt="Website"
                    width={32}
                    height={32}
                  />
                </a>
              )}
              {coin.twitterLink && (
                <a
                  href={coin.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter"
                >
                  <img
                    src="/icons/twitter.svg"
                    alt="Twitter"
                    width={32}
                    height={32}
                  />
                </a>
              )}
            </div>
            {/* View Moreボタン */}
            <button
              onClick={handleViewMore}
              className="absolute right-8 bottom-8 bg-yellow-400 text-[#23262F] font-bold rounded-xl px-8 py-3 text-lg shadow-lg hover:bg-yellow-300 transition"
              style={{ zIndex: 3100 }}
            >
              View More
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
