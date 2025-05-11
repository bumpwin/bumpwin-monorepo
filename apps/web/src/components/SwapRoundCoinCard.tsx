"use client";

import { mockRoundCoins } from "@/mock/mockRoundCoin";
import type { RoundCoin } from "@/types/roundcoin";
import Image from "next/image";
import type React from "react";
import { useState } from "react";

interface SwapRoundCoinCardProps {
  coin?: RoundCoin;
}

const SwapRoundCoinCard: React.FC<SwapRoundCoinCardProps> = ({
  coin = mockRoundCoins[0],
}) => {
  const [amount, setAmount] = useState(0);
  if (!coin) return null;

  // 仮の価格（shareを元にSUI換算）
  const buyPrice = (coin.share * 1).toFixed(2); // 例: 0.35 SUI
  const sellPrice = ((1 - coin.share) * 1).toFixed(2); // 例: 0.65 SUI

  return (
    <div className="bg-[#181A20] border border-[#23262F] rounded-2xl p-4 w-full max-w-xs mx-auto shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src={coin.iconUrl}
          alt={coin.name}
          width={48}
          height={48}
          className="rounded-xl"
        />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg text-white truncate">
            {coin.name}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          className="flex-1 rounded-xl py-3 font-bold text-lg transition bg-green-600 text-white"
        >
          Buy {buyPrice} SUI
        </button>
        <button
          type="button"
          className="flex-1 rounded-xl py-3 font-bold text-lg transition bg-red-600 text-white"
        >
          Sell {sellPrice} SUI
        </button>
      </div>
      <div className="mb-2 text-gray-400 font-medium">Amount</div>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full bg-[#23262F] text-white rounded-lg px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />
        <span className="text-2xl font-bold text-gray-400">$</span>
      </div>
      <div className="flex gap-2 mb-6">
        {[1, 20, 100].map((v) => (
          <button
            type="button"
            key={v}
            className="bg-[#23262F] text-gray-300 rounded-lg px-3 py-1 text-sm font-semibold hover:bg-[#2c2f38]"
            onClick={() => setAmount(amount + v)}
          >
            +${v}
          </button>
        ))}
        <button
          type="button"
          className="bg-[#23262F] text-gray-300 rounded-lg px-3 py-1 text-sm font-semibold hover:bg-[#2c2f38]"
          onClick={() => setAmount(999)}
        >
          Max
        </button>
      </div>
      <button
        type="button"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-lg transition"
      >
        Login to Trade
      </button>
      <div className="mt-6 text-center text-xs text-gray-500">
        By trading, you agree to the{" "}
        <a href="/terms" className="underline">
          Terms of Use
        </a>
        .
      </div>
    </div>
  );
};

export default SwapRoundCoinCard;
