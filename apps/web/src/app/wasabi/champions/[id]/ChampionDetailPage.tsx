"use client";

import { api } from "@/app/client";
import { ChartTitle } from "@/components/charts/ChartTitle";
import { LWCChart, type OHLCData } from "@/components/charts/chart/lwc-chart";
import SwapUI from "@/components/trading/swap/core/SwapUI";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { UIRoundCoinData } from "@/types/ui-types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ChampionDetailPage({
  coin,
  id,
}: {
  coin: UIRoundCoinData;
  id: string;
}) {
  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["mockprice", id],
    queryFn: async () => {
      const res = await api.mockprice.$get({
        query: { seed: id, freq: "day", count: "30" },
      });
      const json = await res.json();

      if ("error" in json) {
        throw new Error(json.error as string);
      }

      return json.data.map(
        (item: {
          timestamp: number;
          open: number;
          high: number;
          low: number;
          close: number;
        }) => {
          const date = new Date(item.timestamp);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const timeStr = `${year}-${month}-${day}`;

          return {
            time: timeStr,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          };
        },
      );
    },
  });

  const fallbackData: OHLCData[] = [];
  const currentPrice =
    priceData && priceData.length > 0 ? (priceData[priceData.length - 1]?.close ?? 0) : 0;

  // Use coin directly as it's already UIRoundCoinData
  const roundCoin = coin;

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="mx-auto flex max-w-5xl flex-1 flex-col px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* チャート（左2/3） */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <Card className="w-full border-none bg-black/20 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <ChartTitle coin={roundCoin} />
              </CardHeader>
              <CardContent>
                {isPriceLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-blue-500 border-t-4 border-b-4" />
                  </div>
                ) : (
                  <LWCChart
                    data={priceData || fallbackData}
                    currentPrice={currentPrice}
                    height={400}
                    className="mt-3"
                  />
                )}
              </CardContent>
            </Card>
          </div>
          {/* コイン詳細パネル（右1/3） */}
          <div className="flex flex-col gap-6">
            <div>
              <SwapUI coin={roundCoin} />
            </div>
            {/* コイン画像・名前・シンボル */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative mb-2 h-28 w-28">
                <Image
                  src={coin.iconUrl}
                  alt={coin.name}
                  width={112}
                  height={112}
                  className="h-full w-full rounded-full border-2 border-yellow-400 object-cover shadow-lg"
                />
                <div className="-top-3 -right-3 absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 font-bold text-base text-black shadow-xl">
                  #{coin.round ?? 0}
                </div>
              </div>
              <div className="flex items-center gap-2 font-bold text-white text-xl">
                {coin.name}
                <span className="text-base text-gray-400">({coin.symbol})</span>
              </div>
            </div>
            {/* bonding curve progress */}
            <div>
              <div className="mb-1 text-gray-300 text-sm">
                bonding curve progress: <span className="font-semibold text-white">1%</span>
              </div>
              <div className="h-2 w-full rounded bg-gray-700">
                <div className="h-2 rounded bg-green-400" style={{ width: "1%" }} />
              </div>
              <div className="mt-1 text-gray-400 text-xs">
                graduate this coin to PumpSwap at $68,387 market cap.
                <br />
                there is 0.007 SOL in the bonding curve.
              </div>
            </div>
            {/* コントラクトアドレス */}
            <div>
              <div className="mb-1 text-gray-300 text-sm">contract address</div>
              <div className="flex items-center gap-2">
                <span className="select-all rounded bg-gray-800 px-2 py-1 font-mono text-gray-200 text-xs">
                  AWWMk...kjR4
                </span>
              </div>
            </div>
            {/* トップホルダーリスト（ダミー） */}
            <div>
              <div className="mb-1 text-gray-300 text-sm">top holders</div>
              <ul className="space-y-1 rounded bg-gray-800 p-2 text-gray-200 text-xs">
                <li>
                  1. bonding curve <span className="float-right">99.97%</span>
                </li>
                <li>
                  2. ZRYco2 <span className="float-right">0.02%</span>
                </li>
                <li>
                  3. Eg1cRg <span className="float-right">0.00%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* 戻るリンク */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/champions"
            className="flex items-center gap-1 font-medium text-base text-blue-400 transition-colors hover:text-blue-300"
          >
            <ArrowLeft size={16} />
            Back to Champions
          </Link>
        </div>
      </div>
    </div>
  );
}
