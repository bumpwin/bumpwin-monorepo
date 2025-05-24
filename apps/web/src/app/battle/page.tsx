"use client";

import { RoundsACard } from "@/app/battle/RoundsACard";
import { mockprice } from "@/app/client";
import { useBattleClock } from "@/app/providers/BattleClockProvider";
import BattleCoinDetailCard from "@/components/BattleCoinDetailCard";
import { ChartTitle } from "@/components/ChartTitle";
import DominanceChartSection from "@/components/DominanceChartSection";
import SharrowStatsBar from "@/components/SharrowStatsBar";
import SwapUI from "@/components/SwapUI";
import type { RoundCoin } from "@/types/roundcoin";
import { useQuery } from "@tanstack/react-query";
import { type MockCoinMetaData, mockmemes } from "@workspace/mockdata";
import {
  Card,
  CardContent,
  CardHeader,
} from "@workspace/shadcn/components/card";
import {
  LWCChart,
  type OHLCData,
} from "@workspace/shadcn/components/chart/lwc-chart";
import { useState } from "react";

// mockmemesをRoundCoin型に変換する関数
const memeToRoundCoin = (meme: MockCoinMetaData): RoundCoin => {
  return {
    id: meme.symbol,
    symbol: meme.symbol,
    name: meme.name,
    iconUrl: meme.iconUrl,
    round: 12,
    share: 0,
    marketCap: 180000,
    description: meme.description,
  };
};

// デフォルトのコイン
const defaultCoin: RoundCoin = {
  id: "default",
  symbol: "YAKIU",
  name: "Yakiu",
  iconUrl: "/images/mockmemes/YAKIU.png",
  round: 12,
  share: 0,
  marketCap: 180000,
  description: "Default coin",
};

export default function RoundsAPage() {
  // Battle Clock Provider から残り時間を取得
  const { remainingTime } = useBattleClock();

  // 残り時間を hh:mm:ss 形式に変換する関数
  const formatRemainingTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 最初のmemeを安全に取得
  const firstMeme = mockmemes.length > 0 ? mockmemes[0] : null;

  // 最初は1つ目のmemeを選択（存在しない場合はデフォルト）
  const [selectedCoin, setSelectedCoin] = useState<RoundCoin>(
    firstMeme ? memeToRoundCoin(firstMeme) : defaultCoin,
  );

  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["mockprice", selectedCoin.id],
    queryFn: async () => {
      const res = await mockprice({
        query: { seed: selectedCoin.id, freq: "day", count: "30" },
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

  // 市場占有率データの計算
  const fallbackData: OHLCData[] = [];
  const currentPrice =
    priceData && priceData.length > 0
      ? (priceData[priceData.length - 1]?.close ?? 0)
      : 0;

  return (
    <div className="flex h-full">
      {/* メインコンテンツ */}
      <main className="flex-1 border-r border-gray-700 overflow-y-auto">
        <div className="h-full flex flex-col">
          {/* SharrowStatsBar - 左カラム上部にsticky固定 */}
          <div className="sticky top-0 z-20 bg-[#181B27]/95">
            <SharrowStatsBar />
          </div>

          {/* DominanceChart Section - Premium Redesign - Cleaner & Brighter */}
          <div className="px-4 py-2">
            <div className="relative">
              {/* Chart with Premium Frame - Brighter */}
              <div className="relative rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm border-none shadow-md">
                {/* Header Bar - Cleaner */}
                <div className="relative px-4 pt-4 pb-2 flex items-center justify-between z-20">
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    Market Dominance
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-xs text-white font-medium">LIVE</span>
                  </div>
                </div>

                {/* The Chart - Clean View */}
                <div className="relative z-0 pb-2">
                  <DominanceChartSection />
                </div>

                {/* Timeline Phases - Clean & Bright */}
                <div className="relative z-20 px-6 pt-1 pb-4">
                  {/* Visual Timeline Bar - Brighter */}
                  <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-yellow-400 to-purple-600 opacity-30 rounded-full overflow-hidden" />

                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 sm:items-center pt-4">
                    {/* Daytime Phase - Brighter */}
                    <div className="relative group flex flex-col gap-2 pb-4 pt-1 sm:py-2 sm:pr-4 sm:border-r border-white/20">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌞</span>
                        <div className="px-2.5 py-1 text-black font-semibold text-sm bg-yellow-300 rounded-full shadow-sm">
                          Daytime
                        </div>
                        <span className="text-sm text-yellow-100 font-medium">
                          (0-24h)
                        </span>
                      </div>
                      <p className="text-gray-200 text-sm max-w-xl leading-relaxed font-medium">
                        A decision market culls the meme swarm into the Finalist
                        8. Time left:
                        <span className="ml-2 font-bold text-orange-500">
                          {formatRemainingTime(remainingTime)}
                        </span>
                      </p>
                    </div>

                    {/* Darknight Phase - Brighter */}
                    <div className="relative group flex flex-col gap-2 pt-4 pb-1 sm:py-2 sm:pl-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌑</span>
                        <div className="px-2.5 py-1 text-white font-semibold text-sm bg-purple-600 rounded-full shadow-sm">
                          Darknight
                        </div>
                        <span className="text-sm text-purple-100 font-medium">
                          (24-25h)
                        </span>
                      </div>
                      <p className="text-gray-200 text-sm max-w-xl leading-relaxed font-medium">
                        Then comes the kill round: five sealed auctions, 12
                        minutes each—trader positions are hidden, only one meme
                        survives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="px-4">
            <Card className="w-full bg-black/20 backdrop-blur-sm border-none mb-4">
              <CardHeader className="pb-2">
                <ChartTitle
                  coin={selectedCoin}
                  percentage={selectedCoin.symbol === "YAKIU" ? "0.9%" : "13%"}
                />
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
                    height={200}
                    className="mt-3"
                    priceLines={[
                      {
                        price:
                          currentPrice *
                          (selectedCoin.symbol === "YAKIU" ? 1.009 : 1.13),
                        color: "#22c55e",
                        lineWidth: 1,
                        lineStyle: 2,
                        axisLabelVisible: true,
                        title: selectedCoin.symbol === "YAKIU" ? "0.9%" : "13%",
                      },
                    ]}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* meme gallery */}
          <div className="px-4 pb-6">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              }}
            >
              {mockmemes.map((meme, i) => (
                <button
                  key={meme.symbol}
                  onClick={() => setSelectedCoin(memeToRoundCoin(meme))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setSelectedCoin(memeToRoundCoin(meme));
                  }}
                  tabIndex={0}
                  className="w-[200px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-xl bg-transparent border-none p-0"
                  aria-pressed={selectedCoin.symbol === meme.symbol}
                  type="button"
                >
                  <RoundsACard
                    imageUrl={meme.iconUrl}
                    symbol={meme.symbol}
                    name={meme.name}
                    percent={i % 2 === 0 ? "0.9%" : "13%"}
                    rank={i + 1}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Swap UI */}
      <aside className="w-[320px] flex-shrink-0 border-l border-gray-700">
        <div className="sticky top-0 p-4">
          <SwapUI coin={selectedCoin} />
          <BattleCoinDetailCard coin={selectedCoin} />
        </div>
      </aside>
    </div>
  );
}
