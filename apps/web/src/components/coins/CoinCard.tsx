"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import type { CoinCardProps } from "@workspace/mockdata";
import Image from "next/image";
import Link from "next/link";

export function CoinCard(props: CoinCardProps) {
  const { id, symbol, name, description, iconUrl, marketCap } = props;
  // コインIDを生成
  const coinId = id.startsWith("0x") ? (Number.parseInt(id.slice(-2), 16) % 3) + 1 : id;

  return (
    <Link href={`/rounds/42/daytime/coins/${coinId}`}>
      <Card className="w-full cursor-pointer overflow-hidden border-gray-700 transition-colors hover:border-blue-400 dark:bg-slate-800">
        <div className="flex p-4">
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
          <div className="min-w-0 flex-1">
            <CardHeader className="p-0 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-md bg-blue-950 px-2 py-1 font-medium text-blue-300 text-xs ring-1 ring-blue-500/20 ring-inset">
                    {symbol}
                  </span>
                  <CardTitle className="font-bold text-lg text-white">{name}</CardTitle>
                </div>
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
