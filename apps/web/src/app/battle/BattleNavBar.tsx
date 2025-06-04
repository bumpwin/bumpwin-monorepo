"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";

export interface BattleNavBarProps {
  round: number;
  mcap: string;
  memes: number;
  volume: string;
  timeLeft: string;
  topCoin: { symbol: string; iconUrl: string };
}

export const BattleNavBar: React.FC<BattleNavBarProps> = ({
  round,
  mcap,
  memes,
  volume,
  timeLeft,
  topCoin,
}) => {
  // タイマーのリアルタイム更新例（timeLeftは"HH:MM:SS"形式のダミー値でOK）
  const [timer, setTimer] = useState(timeLeft);
  useEffect(() => {
    // ダミーのカウントダウン（実際はUNIXタイム等で計算）
    let [h = 0, m = 0, s = 0] = timer.split(":").map(Number);
    const interval = setInterval(() => {
      if (h === 0 && m === 0 && s === 0) return;
      s--;
      if (s < 0) {
        s = 59;
        m--;
      }
      if (m < 0) {
        m = 59;
        h--;
      }
      setTimer(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <nav className="sticky top-[var(--header-height)] z-50 mx-auto flex w-full max-w-[calc(100vw-24rem)] items-center justify-start gap-6 border-orange-500 border-b-2 bg-black/90 px-6 py-2 font-medium text-base text-white shadow-lg backdrop-blur-md">
      <span className="font-bold text-orange-400 text-xl">🕹 Battle Round {round}</span>
      <span className="flex items-center gap-1">
        💰 <span className="font-bold">MCap {mcap}</span>
      </span>
      <span className="flex items-center gap-1">🧠 {memes} memes</span>
      <span className="flex items-center gap-1">
        📈 Vol <span className="font-bold">{volume}</span>
      </span>
      <span className="flex items-center gap-1">
        ⏳ <span className="font-mono text-lg">{timer}</span>
      </span>
      <span className="ml-auto flex items-center gap-1">
        🔥 #1:
        <Image
          src={topCoin.iconUrl}
          alt={topCoin.symbol}
          width={28}
          height={28}
          className="rounded-full border border-orange-400 bg-white"
        />
        <span className="font-bold text-lg text-orange-300">${topCoin.symbol}</span>
      </span>
    </nav>
  );
};
