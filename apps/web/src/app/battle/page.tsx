"use client";

import { RoundsACard } from "@/app/battle/RoundsACard";
import { mockprice } from "@/app/client";
import DominanceChartSection from "@/components/DominanceChartSection";
import InfoBar from "@/components/InfoBar";
import StatsBar from "@/components/StatsBar";
import SwapUI from "@/components/SwapUI";
import type { RoundCoin } from "@/types/roundcoin";
import { useQuery } from "@tanstack/react-query";
import { type MockCoinMetaData, mockmemes } from "@workspace/mockdata";
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
import { useEffect, useState } from "react";

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
  const [isCompact, setIsCompact] = useState(false);
  // 最初のmemeを安全に取得
  const firstMeme = mockmemes.length > 0 ? mockmemes[0] : null;

  // 最初は1つ目のmemeを選択（存在しない場合はデフォルト）
  const [selectedCoin, setSelectedCoin] = useState<RoundCoin>(
    firstMeme ? memeToRoundCoin(firstMeme) : defaultCoin,
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // 100px以上スクロールしたらコンパクトモードに
      setIsCompact(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          {/* タイトル - スクロール可能 */}
          <div className="px-4 pt-4">
            <h1 className="text-4xl font-extrabold text-white mb-6 mt-4 text-center tracking-tight drop-shadow-lg">
              Battle Round 7
            </h1>
          </div>

          {/* StatsBar - 固定部分 */}
          <div className="sticky top-0 z-30 transition-all duration-300">
            <StatsBar compact={isCompact} />
          </div>

          {/* Dominance Chart - スクロール可能な部分 */}
          <div className="px-4">
            <DominanceChartSection />
          </div>

          {/* Price Chart */}
          <div className="px-4">
            <Card className="w-full bg-black/20 backdrop-blur-sm border-none mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-white">
                  Price Chart of ${selectedCoin.symbol}
                </CardTitle>
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

          {/* Coin Details */}
          <Card className="w-full bg-black/20 backdrop-blur-sm border-none mt-4">
            <CardHeader>
              <div className="flex flex-col items-center gap-4">
                <img
                  src={selectedCoin.iconUrl}
                  alt={selectedCoin.symbol}
                  className="w-full h-auto max-h-[400px] object-contain"
                />
                <div className="text-center">
                  <CardTitle className="text-2xl font-bold text-white">
                    {selectedCoin.symbol}
                  </CardTitle>
                  <p className="text-lg text-gray-400 mt-1">
                    {selectedCoin.name}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {selectedCoin.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </aside>
    </div>
  );
}
