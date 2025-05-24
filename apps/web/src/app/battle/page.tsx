"use client";

import { RoundsACard } from "@/app/battle/RoundsACard";
import { mockprice } from "@/app/client";
import BattleCoinDetailCard from "@/components/BattleCoinDetailCard";
import { ChartTitle } from "@/components/ChartTitle";
import DominanceChartSection from "@/components/DominanceChartSection";
import SharrowStatsBar from "@/components/SharrowStatsBar";
import SwapUI from "@/components/SwapUI";
import type { RoundCoin } from "@/types/roundcoin";
import * as Progress from "@radix-ui/react-progress";
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
import { Progress as ShadcnProgress } from "@workspace/shadcn/components/progress";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TOTAL_HOURS = 25;
const DAYTIME_END = 24;

// データ生成用のヘルパー関数
const generateTimeData = () => {
  return Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => ({
    hour: i,
    value: 1,
    isDarknight: i >= DAYTIME_END,
  }));
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-2 rounded border border-gray-700">
        <p className="text-yellow-400 font-bold">{`${label}h`}</p>
        <p className="text-gray-400">
          {label >= DAYTIME_END ? "Darknight" : "Daytime"}
        </p>
      </div>
    );
  }
  return null;
};

// Recharts版のプログレスバー
const RechartsProgressBar = ({ currentHour }: { currentHour: number }) => {
  const data = generateTimeData();

  return (
    <div className="w-full space-y-2">
      <div className="h-24 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="daytime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="darknight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7e22ce" />
                <stop offset="100%" stopColor="#312e81" />
              </linearGradient>
            </defs>

            {/* Daytime Area */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#daytime)"
              fillOpacity={0.8}
              isAnimationActive={false}
            />

            {/* Darknight Area */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#darknight)"
              fillOpacity={0.8}
              isAnimationActive={false}
              data={data.filter((d) => d.isDarknight)}
            />

            {/* Current Time Reference Line */}
            <ReferenceLine
              x={currentHour}
              stroke="#eab308"
              strokeWidth={2}
              label={{
                value: `${currentHour}h`,
                position: "top",
                fill: "#eab308",
                fontSize: 12,
                fontWeight: "bold",
              }}
            />

            {/* 24hにカスタムアイコン（🌙）を表示 */}
            <ReferenceLine
              x={24}
              stroke="#a78bfa"
              strokeWidth={3}
              label={{
                value: "🌙",
                position: "top",
                fontSize: 28,
              }}
            />

            <XAxis
              dataKey="hour"
              tickCount={6}
              tickFormatter={(value) => `${value}h`}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#374151" }}
              tickLine={{ stroke: "#374151" }}
            />

            <YAxis hide={true} domain={[0, 1]} />

            <Tooltip content={<CustomTooltip />} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 凡例 */}
      <div className="flex justify-between px-1">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-600" />
          <span className="text-xs text-gray-400">Daytime (0-24h)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-900 to-indigo-900" />
          <span className="text-xs text-gray-400">Darknight (24-25h)</span>
        </div>
      </div>
    </div>
  );
};

// 時間マーカー用の配列を生成
const generateTimeMarkers = () => {
  return Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => ({
    id: `marker-${i}`,
    position: (i / TOTAL_HOURS) * 100,
  }));
};

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

  const [currentHour, setCurrentHour] = useState(12);

  return (
    <div className="flex h-full">
      {/* メインコンテンツ */}
      <main className="flex-1 border-r border-gray-700 overflow-y-auto">
        <div className="h-full flex flex-col">
          {/* SharrowStatsBar - 左カラム上部にsticky固定 */}
          <div className="sticky top-0 z-20 bg-[#181B27]/95">
            <SharrowStatsBar />
          </div>

          {/* DominanceChart Section - Premium Redesign */}
          <div className="px-4 py-2">
            <div className="relative">
              {/* Overlay Gradient Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10" />
              <div className="absolute -inset-x-4 -top-6 h-12 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10" />

              {/* Chart with Premium Frame */}
              <div className="relative rounded-xl overflow-hidden backdrop-blur-sm border border-white/5 shadow-xl">
                {/* Glowing Accent */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-purple-500/20 to-blue-500/20 blur-2xl opacity-50" />

                {/* Header Bar */}
                <div className="relative px-4 pt-4 pb-2 flex items-center justify-between z-20">
                  <h2 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Market Dominance</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                    <span className="text-xs text-white/70 font-medium">LIVE</span>
                  </div>
                </div>

                {/* The Chart */}
                <div className="relative z-0">
                  <DominanceChartSection />
                </div>

                {/* Timeline Phases - Elegant Version */}
                <div className="relative z-20 px-6 pt-1 pb-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 sm:items-center">
                    {/* Phase Divider Line */}
                    <div className="hidden sm:block absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Daytime Phase */}
                    <div className="relative group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 pb-2 pt-1 sm:pb-0">
                      <div className="flex items-center">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md group-hover:bg-yellow-400/30 transition-all duration-500" />
                          <span className="text-2xl relative z-10">🌞</span>
                          <div className="absolute right-0 h-0.5 w-8 bg-gradient-to-r from-yellow-400/80 to-transparent hidden sm:block" />
                        </div>
                        <div className="ml-3 flex flex-col">
                          <div className="relative inline-flex items-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-300 opacity-90 rounded-full -z-10 group-hover:from-yellow-200 group-hover:to-yellow-400 transition-all duration-300" />
                            <span className="px-3 py-0.5 text-black font-bold tracking-wide text-sm">
                              Daytime <span className="text-xs text-yellow-800/80 font-medium">(0-24h)</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm sm:ml-2 max-w-xl leading-relaxed font-medium tracking-wide group-hover:text-white transition-colors duration-300">
                        A decision market culls the meme swarm into the Finalist 8.
                      </p>
                    </div>

                    {/* Darknight Phase */}
                    <div className="relative group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 pt-3 sm:pt-0">
                      <div className="flex items-center">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-purple-700/30 rounded-full blur-md group-hover:bg-purple-600/40 transition-all duration-500" />
                          <span className="text-2xl relative z-10">🌑</span>
                          <div className="absolute right-0 h-0.5 w-8 bg-gradient-to-r from-purple-500/80 to-transparent hidden sm:block" />
                        </div>
                        <div className="ml-3 flex flex-col">
                          <div className="relative inline-flex items-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 opacity-90 rounded-full -z-10 group-hover:from-purple-600 group-hover:to-purple-800 transition-all duration-300" />
                            <span className="px-3 py-0.5 text-white font-bold tracking-wide text-sm">
                              Darknight <span className="text-xs text-purple-200/90 font-medium">(24-25h)</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm sm:ml-2 max-w-xl leading-relaxed font-medium tracking-wide group-hover:text-white transition-colors duration-300">
                        Then comes the kill round: five sealed auctions, 12 minutes each—trader positions are hidden, only one meme survives.
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
