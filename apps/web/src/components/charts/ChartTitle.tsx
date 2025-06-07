"use client";

import { CardTitle } from "@/components/ui/card";
import type { CoinWithRound } from "@/types/coin-with-round";
import Image from "next/image";

interface ChartTitleProps {
  coin: CoinWithRound;
  percentage?: string;
}

export const ChartTitle = ({ coin, percentage = "13%" }: ChartTitleProps) => {
  return (
    <CardTitle className="flex items-center gap-2 font-medium text-lg text-white">
      <div className="relative h-8 w-8">
        <Image src={coin.iconUrl} alt={coin.symbol} fill className="rounded-lg object-cover" />
      </div>
      <span>
        {coin.symbol} ({coin.name})
      </span>
      <span className="mx-2 h-5 border-gray-500 border-l opacity-60" />
      <span className="text-green-400">Market Cap: ${coin.marketCap.toLocaleString()}</span>
      <span className="mx-2 h-5 border-gray-500 border-l opacity-60" />
      <span className="text-green-400">Chance: {percentage}</span>
    </CardTitle>
  );
};
