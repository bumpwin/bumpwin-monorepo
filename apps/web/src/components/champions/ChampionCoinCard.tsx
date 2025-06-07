"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import type { MemeMarketData, MemeMetadata } from "@workspace/types";
import Image from "next/image";
import Link from "next/link";

interface ChampionCoinCardProps extends MemeMetadata, MemeMarketData {
  round?: number;
}

export function ChampionCoinCard({
  id,
  symbol,
  name,
  description,
  iconUrl,
  marketCap,
  round,
}: ChampionCoinCardProps) {
  // コインIDを生成
  const coinId = id.startsWith("0x") ? (Number.parseInt(id.slice(-2), 16) % 3) + 1 : id;

  return (
    <Link href={`/rounds/42/daytime/coins/${coinId}`}>
      <Card className="w-full cursor-pointer overflow-hidden border-gray-700 transition-colors hover:border-blue-400 dark:bg-slate-800">
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
                src={iconUrl}
                alt={`${symbol} logo`}
                fill
                className="rounded-md object-cover"
              />
            </div>
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
                </div>
              </div>
            </div>

            <CardContent className="flex flex-1 flex-col p-0">
              <p className="mb-2 line-clamp-2 flex-grow text-gray-400 text-sm">{description}</p>
              <div className="mt-auto flex items-end justify-between">
                <div className="font-medium text-gray-300 text-sm">{formatCurrency(marketCap)}</div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
}
