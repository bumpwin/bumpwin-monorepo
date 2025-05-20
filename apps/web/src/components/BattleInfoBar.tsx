import type React from "react";
import Image from "next/image";

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
  topCoin = { symbol: "MONKE", iconUrl: "/monke-icon.png" }
}) => {
  return (
    <div className="w-full bg-black border-t border-b border-orange-600/30">
      <div className="flex items-center justify-between px-8 py-2">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <span className="text-orange-500 mr-2">🔥</span>
            <span className="text-white font-bold">Battle Round {round}</span>
          </div>

          <div className="flex items-center">
            <span className="text-yellow-400 mr-2">💰</span>
            <span className="text-white">MCap {mcap}</span>
          </div>

          <div className="flex items-center">
            <span className="text-pink-400 mr-2">🟣</span>
            <span className="text-white">{memes} memes</span>
          </div>

          <div className="flex items-center">
            <span className="text-blue-400 mr-2">📊</span>
            <span className="text-white">Vol {volume}</span>
          </div>

          <div className="flex items-center">
            <span className="text-green-400 mr-2">⏱️</span>
            <span className="text-white font-mono">{timeLeft}</span>
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-orange-400 mr-2">#1:</span>
          {topCoin.iconUrl && (
            <div className="relative w-6 h-6 mr-1">
              <Image
                src={topCoin.iconUrl}
                alt={`${topCoin.symbol} icon`}
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
          )}
          <span className="text-yellow-400 font-bold">${topCoin.symbol}</span>
        </div>
      </div>
    </div>
  );
};

export default BattleInfoBar;