import Image from "next/image";
import type React from "react";

interface BattleInfoBarProps {
  round?: number;
  mcap?: string;
  memes?: number;
  volume?: string;
  timeLeft?: string;
  topCoin?: { symbol: string; iconUrl: string };
}

export const BattleInfoBar: React.FC<BattleInfoBarProps> = ({
  round = 12,
  mcap = "$24,000",
  memes = 24,
  volume = "$6,200",
  timeLeft = "03:15:37",
  topCoin = { symbol: "MONKE", iconUrl: "/monke-icon.png" },
}) => {
  return (
    <div className="w-full border-orange-600/30 border-t border-b bg-black">
      <div className="flex items-center justify-between px-8 py-2">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <span className="mr-2 text-orange-500">🔥</span>
            <span className="font-bold text-white">Battle Round {round}</span>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-yellow-400">💰</span>
            <span className="text-white">MCap {mcap}</span>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-pink-400">🟣</span>
            <span className="text-white">{memes} memes</span>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-blue-400">📊</span>
            <span className="text-white">Vol {volume}</span>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-green-400">⏱️</span>
            <span className="font-mono text-white">{timeLeft}</span>
          </div>
        </div>

        <div className="flex items-center">
          <span className="mr-2 text-orange-400">#1:</span>
          {topCoin.iconUrl && (
            <div className="relative mr-1 h-6 w-6">
              <Image
                src={topCoin.iconUrl}
                alt={`${topCoin.symbol} icon`}
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
          )}
          <span className="font-bold text-yellow-400">${topCoin.symbol}</span>
        </div>
      </div>
    </div>
  );
};

export default BattleInfoBar;
