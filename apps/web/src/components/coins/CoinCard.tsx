"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CoinCardProps } from "@/types/coincard";
import { formatCurrency } from "@/utils/format";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function CoinCard({
  address,
  symbol,
  name,
  description,
  logoUrl,
  marketCap,
  isFavorite: initialIsFavorite,
  onToggleFavorite,
}: CoinCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // カード全体のクリックイベントを停止
    e.preventDefault(); // リンクへの遷移をキャンセル
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(address);
    }
  };

  // コインIDを生成（addressがそのまま使える場合はそれを、
  // なければ名前などから一意のIDを生成）
  const coinId = address.startsWith("0x")
    ? // 数値IDを使用（addressの末尾から生成）
      (Number.parseInt(address.slice(-2), 16) % 3) + 1
    : address;

  return (
    <Link href={`/rounds/42/daytime/coins/${coinId}`}>
      <Card className="w-full cursor-pointer overflow-hidden border-gray-700 transition-colors hover:border-blue-400 dark:bg-slate-800">
        <div className="flex p-4">
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
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <CardHeader className="p-0 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-md bg-blue-950 px-2 py-1 font-medium text-blue-300 text-xs ring-1 ring-blue-500/20 ring-inset">
                    {symbol}
                  </span>
                  <CardTitle className="font-bold text-lg text-white">{name}</CardTitle>
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
            </CardHeader>

            <CardContent className="p-0">
              <CardDescription className="mb-2 line-clamp-2 text-gray-400 text-sm">
                {description}
              </CardDescription>
              <div className="font-medium text-gray-300 text-sm">{formatCurrency(marketCap)}</div>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
}
