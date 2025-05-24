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
    <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
      <div className="relative w-8 h-8">
        <Image
          src={coin.iconUrl}
          alt={coin.symbol}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <span>
        {coin.symbol} ({coin.name})
      </span>
      <span className="mx-2 h-5 border-l border-gray-500 opacity-60" />
      <span className="text-green-400">
        Market Cap: ${coin.marketCap.toLocaleString()}
      </span>
      <span className="mx-2 h-5 border-l border-gray-500 opacity-60" />
      <span className="text-green-400">Chance: {percentage}</span>
    </CardTitle>
  );
};
