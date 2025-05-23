"use client";

import { mockprice } from "@/app/client";
import SwapUI from "@/components/SwapUI";
import type { Coin } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/shadcn/components/card";
import {
  LWCChart,
  type OHLCData,
} from "@workspace/shadcn/components/chart/lwc-chart";
import { ArrowLeft, Globe, Send, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export const ChampionDetailPage = ({
  coin,
  id,
}: { coin: Coin; id: string }) => {
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
    description: coin.description,
    telegramLink: coin.telegramLink,
    websiteLink: coin.websiteLink,
    twitterLink: coin.twitterLink,
    color: coin.color,
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      {/* タイトル */}
      <div className="px-8 pt-8 pb-4">
        <h1
          className="text-5xl font-extrabold text-center mb-4 tracking-tight drop-shadow-lg"
          style={{
            background:
              "linear-gradient(90deg, #FFD700 0%, #FFEB80 50%, #FFC700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          HALL OF CHAMPIONS
        </h1>
      </div>
      {/* メイン2カラム */}
      <div className="flex flex-1 px-8 pb-8 gap-8 items-start min-h-[600px]">
        {/* 左: 詳細/チャート/Stats/About */}
        <div className="flex-1 flex flex-col gap-6">
          {/* コイン情報カード */}
          <Card className="bg-black/20 border border-[#23262F] hover:border-yellow-400 transition-colors shadow-lg">
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
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-yellow-200 to-yellow-600 text-black border-2 border-white">
                      #{coin.round}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">
                          {coin.name}
                        </h3>
                        <span className="text-sm text-gray-400">
                          ({coin.symbol})
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {coin.description.substring(0, 100)}...
                      </p>
                    </div>
                    <Link
                      href="/champions"
                      className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Champions</span>
                    </Link>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Market Cap:</span>
                      <span className="text-white font-medium">
                        {formatMarketCap(coin.marketCap)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Created by:</span>
                      <span className="text-white font-medium">BUMP.WIN</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3">
                    {coin.websiteLink && (
                      <a
                        href={coin.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {coin.telegramLink && (
                      <a
                        href={coin.telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </a>
                    )}
                    {coin.twitterLink && (
                      <a
                        href={coin.twitterLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* チャート */}
          <Card className="bg-black/20 border-[#23262F]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              {isPriceLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
                </div>
              ) : (
                <LWCChart
                  data={priceData || fallbackData}
                  currentPrice={currentPrice}
                  height={240}
                />
              )}
            </CardContent>
          </Card>
          {/* 追加情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-[#23262F]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">
                  Champion Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Round:</span>
                    <span className="text-white font-medium">
                      #{coin.round}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap:</span>
                    <span className="text-white font-medium">
                      {formatMarketCap(coin.marketCap)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Share:</span>
                    <span className="text-white font-medium">
                      {coin.share}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/20 border-[#23262F]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">{coin.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* 右: Swap UI */}
        <div className="w-96 flex-shrink-0 self-start">
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-4">
            <SwapUI coin={roundCoin} />
          </div>
        </div>
      </div>
      {/* 右端チャットはLayoutWithChatに任せる */}
    </div>
  );
};
