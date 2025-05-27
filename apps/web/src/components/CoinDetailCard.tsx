"use client";

import { Card, CardContent } from "@workspace/shadcn/components/card";
import type { MemeMarketData, MemeMetadata } from "@workspace/types";
import Image from "next/image";

// Format market cap to K/M/B format
const formatMarketCap = (value: number | undefined): string => {
  if (!value) return "$0.0";
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return `$${value.toFixed(1)}`;
};

interface CoinDetailCardProps {
  coin: MemeMetadata & Partial<MemeMarketData> & { round: number };
  variant?: "default" | "champion";
}

export const CoinDetailCard: React.FC<CoinDetailCardProps> = ({
  coin,
  variant = "default",
}) => {
  return (
    <Card
      className={`bg-black/20 border border-[#23262F] ${
        variant === "champion"
          ? "hover:border-yellow-400"
          : "hover:border-purple-400"
      } transition-colors shadow-lg`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="relative w-24 h-24">
              <Image
                src={coin.iconUrl}
                alt={coin.name}
                width={96}
                height={96}
                className="rounded-full w-full h-full object-cover"
              />
              <div
                className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  variant === "champion"
                    ? "bg-gradient-to-br from-yellow-200 to-yellow-600"
                    : "bg-gradient-to-br from-purple-200 to-purple-600"
                } text-black border-2 border-white`}
              >
                #{coin.round}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-xl font-bold ${
                      variant === "champion" ? "text-yellow-400" : "text-white"
                    }`}
                  >
                    {coin.name}
                  </h3>
                  <span className="text-sm text-gray-400">({coin.symbol})</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {coin.description.substring(0, 100)}...
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Market Cap:</span>
                <span className="text-white font-medium">
                  {formatMarketCap(coin.marketCap)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
