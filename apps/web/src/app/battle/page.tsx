"use client";

import { RoundsACard } from "@/app/battle/RoundsACard";
import { mockprice } from "@/app/client";
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

          {/* Dominance Chart - スクロール可能な部分 */}
          <div className="px-4">
            <DominanceChartSection />
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
