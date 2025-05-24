"use client";

import type { RoundCoin } from "@/types/roundcoin";
import { CardTitle } from "@workspace/shadcn/components/card";

interface ChartTitleProps {
  coin: RoundCoin;
  percentage?: string;
}

export const ChartTitle = ({ coin, percentage = "13%" }: ChartTitleProps) => {
  return (
    <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
      <img
        src={coin.iconUrl}
        alt={coin.symbol}
        className="w-8 h-8 rounded-lg object-cover"
      />
      <span>{coin.symbol} ({coin.name})</span>
      <span className="text-green-500">Market Cap: ${coin.marketCap.toLocaleString()}</span>
      <span className="text-green-500">{percentage}</span>
    </CardTitle>
  );
};
