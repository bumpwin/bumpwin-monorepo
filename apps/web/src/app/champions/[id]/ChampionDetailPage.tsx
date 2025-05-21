"use client";

import { mockprice } from "@/app/client";
import CommunicationPanel from "@/components/CommunicationPanel";
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
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Send, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Format market cap to K/M/B format
const formatMarketCap = (value: number): string => {
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
    description: coin.description,
    telegramLink: coin.telegramLink,
    websiteLink: coin.websiteLink,
    twitterLink: coin.twitterLink,
    color: coin.color,
  };

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex-1 flex flex-col max-w-5xl mx-auto py-8 px-4">
        {/* HALL OF CHAMPIONS Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-yellow-400">
            HALL OF CHAMPIONS
          </h1>
          <p className="text-xl text-yellow-300 mt-4">
            The greatest champions of the Battle Royale
          </p>
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative">
            <div className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black/20 border border-[#23262F] rounded-2xl p-6 hover:border-yellow-400 transition-colors shadow-lg"
              >
                <div className="flex items-start gap-6">
                  {/* Left: Coin Info */}
                  <div className="flex-1 flex items-start gap-6">
                    <div className="relative">
                      <div className="relative w-28 h-28">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-900 p-[4px] shadow-[0_0_24px_4px_rgba(255,215,0,0.25)]">
                          <div className="absolute inset-0 rounded-full bg-white p-[2px]">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-600 opacity-70" />
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                              <Image
                                src={coin.iconUrl}
                                alt={coin.name}
                                width={112}
                                height={112}
                                className="rounded-full w-full h-full object-cover border-0"
                              />
                              <div className="absolute left-2 top-2 w-2/3 h-1/4 bg-white/60 rounded-full blur-md rotate-[-20deg]" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center text-base font-bold bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 text-black shadow-xl border-2 border-white">
                          #{coin.round}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white truncate">
                          {coin.name}
                        </h3>
                        <span className="text-sm text-gray-400">
                          ({coin.symbol})
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {coin.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Market Cap:</span>
                          <span className="text-white font-medium">
                            {formatMarketCap(coin.marketCap)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Created by:</span>
                          <span className="text-white font-medium">
                            {coin.createdBy || "Unknown"}
                          </span>
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
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* チャート（左2/3） */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Card className="w-full bg-black/20 backdrop-blur-sm border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-white">
                  Price Chart
                </CardTitle>
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
            {/* トップホルダーリスト（ダミー） */}
            <div>
              <div className="text-sm text-gray-300 mb-1">top holders</div>
              <ul className="text-xs text-gray-200 bg-gray-800 rounded p-2 space-y-1">
                <li>
                  1. ZRYco2 <span className="float-right">0.02%</span>
                </li>
                <li>
                  2. Eg1cRg <span className="float-right">0.00%</span>
                </li>
                <li>
                  3. 8Kj2Lm <span className="float-right">0.00%</span>
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
      {/* 右側チャット欄 */}
      <aside className="hidden lg:block w-96">
        <CommunicationPanel />
      </aside>
    </div>
  );
}
