"use client";

import type { Coin } from "@/types";
import { Card, CardContent } from "@workspace/shadcn/components/card";
import { Globe, Send, Twitter } from "lucide-react";
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
  coin: Coin;
  variant?: "default" | "champion";
}

export const CoinDetailCard: React.FC<CoinDetailCardProps> = ({ coin, variant = "default" }) => {
  return (
    <Card
      className={`border border-[#23262F] bg-black/20 ${
        variant === "champion" ? "hover:border-yellow-400" : "hover:border-purple-400"
      } shadow-lg transition-colors`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="relative h-24 w-24">
              <Image
                src={coin.iconUrl}
                alt={coin.name}
                width={96}
                height={96}
                className="h-full w-full rounded-full object-cover"
              />
              <div
                className={`-top-2 -right-2 absolute flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                  variant === "champion"
                    ? "bg-gradient-to-br from-yellow-200 to-yellow-600"
                    : "bg-gradient-to-br from-purple-200 to-purple-600"
                } border-2 border-white text-black`}
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
                    className={`font-bold text-xl ${
                      variant === "champion" ? "text-yellow-400" : "text-white"
                    }`}
                  >
                    {coin.name}
                  </h3>
                  <span className="text-gray-400 text-sm">({coin.symbol})</span>
                </div>
                <p className="mt-1 text-gray-400 text-sm">
                  {coin.description.substring(0, 100)}...
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Market Cap:</span>
                <span className="font-medium text-white">{formatMarketCap(coin.marketCap)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Created by:</span>
                <span className="font-medium text-white">BUMP.WIN</span>
              </div>
            </div>
            <div className="mt-3 flex gap-3">
              {coin.websiteLink && (
                <a
                  href={coin.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {coin.telegramLink && (
                <a
                  href={coin.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Send className="h-5 w-5" />
                </a>
              )}
              {coin.twitterLink && (
                <a
                  href={coin.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
