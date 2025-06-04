"use client";

import type { CoinCardProps } from "@/types/coincard";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent } from "@workspace/shadcn/components/card";
import { cn } from "@workspace/shadcn/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

export function ChampionCoinCard({
  address,
  symbol,
  name,
  description,
  logoUrl,
  marketCap,
  isFavorite: initialIsFavorite,
  onToggleFavorite,
  round,
  performanceTag,
  winRate,
  priceHistory,
  role,
  isHighlighted,
}: CoinCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // カード全体のクリックイベントを停止
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(address);
    }
  };

  const formattedWinRate = winRate ? `${Math.round(winRate * 100)}% Win Rate` : null;

  // コインIDを生成（addressがそのまま使える場合はそれを、
  // なければ名前などから一意のIDを生成）
  const coinId = address.startsWith("0x")
    ? // 数値IDを使用（addressの末尾から生成）
      (Number.parseInt(address.slice(-2), 16) % 3) + 1
    : address;

  return (
    <Link href={`/rounds/42/daytime/coins/${coinId}`}>
      <Card
        className={cn(
          "w-full cursor-pointer overflow-hidden border-gray-700 transition-colors hover:border-blue-400 dark:bg-slate-800",
          isHighlighted && "border-2 border-blue-500",
        )}
      >
        {round && (
          <div className="bg-slate-700 px-4 py-1 font-medium text-gray-300 text-sm">
            &lt; Round {round} &gt;
          </div>
        )}
        <div className="flex h-[180px] p-4">
          {/* Logo */}
          <div className="mr-4 flex-shrink-0">
            <div className="relative h-16 w-16">
              <Image
                src={logoUrl}
                alt={`${symbol} logo`}
                fill
                className="rounded-md object-cover"
              />
            </div>
            {role && <div className="mt-2 text-center text-gray-400 text-xs">{role}</div>}
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-md bg-blue-950 px-2 py-1 font-medium text-blue-300 text-xs ring-1 ring-blue-500/20 ring-inset">
                    {symbol}
                  </span>
                  <h3 className="font-bold text-lg text-white">{name}</h3>
                  {performanceTag && (
                    <span className="ml-2 font-bold text-sm text-yellow-400">
                      **{performanceTag}**
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-yellow-400 focus:outline-none"
                  onClick={handleToggleFavorite}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star
                    className={cn(
                      "h-5 w-5",
                      isFavorite ? "fill-yellow-400 text-yellow-400" : "fill-transparent",
                    )}
                  />
                </button>
              </div>
            </div>

            <CardContent className="flex flex-1 flex-col p-0">
              {formattedWinRate && (
                <div className="mb-1 font-medium text-green-400 text-sm">{formattedWinRate}</div>
              )}
              <p className="mb-2 line-clamp-2 flex-grow text-gray-400 text-sm">{description}</p>
              <div className="mt-auto flex items-end justify-between">
                <div className="font-medium text-gray-300 text-sm">{formatCurrency(marketCap)}</div>
                {priceHistory && priceHistory.length > 0 && (
                  <div className="h-12 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceHistory}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke="#3b82f6"
                          strokeWidth={1.5}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
}
