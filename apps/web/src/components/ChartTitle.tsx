"use client";

import type { RoundCoin } from "@/types/roundcoin";
import { CardTitle } from "@workspace/shadcn/components/card";
import Image from "next/image";

interface ChartTitleProps {
  coin: RoundCoin;
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
