"use client";

import { mockprice } from "@/app/client";
import { ChartTitle } from "@/components/ChartTitle";
import SwapUI from "@/components/ui/swap/core/SwapUI";
import type { Coin } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
} from "@workspace/shadcn/components/card";
import {
  LWCChart,
  type OHLCData,
} from "@workspace/shadcn/components/chart/lwc-chart";
import { ArrowLeft, Globe, Send, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ChampionDetailPage({ coin, id }: { coin: Coin; id: string }) {
  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["mockprice", id],
    queryFn: async () => {
      const res = await mockprice({
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
    priceData && priceData.length > 0
      ? (priceData[priceData.length - 1]?.close ?? 0)
      : 0;

  // champion coin を RoundCoin 型にマッピング
  const roundCoin = {
    id: coin.id.toString(),
    symbol: coin.symbol,
    name: coin.name,
    iconUrl: coin.iconUrl,
    round: coin.round,
    share: coin.share ?? 0,
    marketCap: coin.marketCap ?? 0,
    price: currentPrice,
    description: coin.description,
    telegramLink: coin.telegramLink,
    websiteLink: coin.websiteLink,
    twitterLink: coin.twitterLink,
    color: coin.color,
  };

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex-1 flex flex-col max-w-5xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* チャート（左2/3） */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Card className="w-full bg-black/20 backdrop-blur-sm border-none">
              <CardHeader className="pb-2">
                <ChartTitle coin={roundCoin} />
              </CardHeader>
              <CardContent>
                {isPriceLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
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
              <div className="relative w-28 h-28 mb-2">
                <Image
                  src={coin.iconUrl}
                  alt={coin.name}
                  width={112}
                  height={112}
                  className="rounded-full w-full h-full object-cover border-2 border-yellow-400 shadow-lg"
                />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-base font-bold bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 text-black shadow-xl border-2 border-white">
                  #{coin.round}
                </div>
              </div>
              <div className="text-xl font-bold text-white flex items-center gap-2">
                {coin.name}
                <span className="text-base text-gray-400">({coin.symbol})</span>
              </div>
            </div>
            {/* bonding curve progress */}
            <div>
              <div className="text-sm text-gray-300 mb-1">
                bonding curve progress:{" "}
                <span className="font-semibold text-white">1%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded">
                <div
                  className="h-2 bg-green-400 rounded"
                  style={{ width: "1%" }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                graduate this coin to PumpSwap at $68,387 market cap.
                <br />
                there is 0.007 SOL in the bonding curve.
              </div>
            </div>
            {/* コントラクトアドレス */}
            <div>
              <div className="text-sm text-gray-300 mb-1">contract address</div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded text-gray-200 select-all">
                  AWWMk...kjR4
                </span>
              </div>
            </div>
            {/* 外部リンク */}
            <div className="flex gap-3">
              {coin.telegramLink && (
                <a
                  href={coin.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Telegram"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Send size={28} />
                </a>
              )}
              {coin.websiteLink && (
                <a
                  href={coin.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Website"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Globe size={28} />
                </a>
              )}
              {coin.twitterLink && (
                <a
                  href={coin.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Twitter size={28} />
                </a>
              )}
            </div>
            {/* トップホルダーリスト（ダミー） */}
            <div>
              <div className="text-sm text-gray-300 mb-1">top holders</div>
              <ul className="text-xs text-gray-200 bg-gray-800 rounded p-2 space-y-1">
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
            className="text-blue-400 hover:text-blue-300 text-base font-medium transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to Champions
          </Link>
        </div>
      </div>
    </div>
  );
}
