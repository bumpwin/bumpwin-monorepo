"use client";

import { mockprice } from "@/app/client";
import CommunicationPanel from "@/components/CommunicationPanel";
import DominanceChart from "@/components/DominanceChart";
import SwapUI from "@/components/SwapUI";
import type { DominanceChartData } from "@/types/dominance";
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
import { useState } from "react";
import { RoundsACard } from "./RoundsACard";

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

// ダミードミナンスデータの作成
const createMockDominanceData = (): DominanceChartData => {
  // 現在時刻から6時間のデータを生成
  const now = new Date();
  const points = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now);
    date.setHours(date.getHours() - (11 - i) / 2);

    return {
      date: date.toISOString(),
      LAG: 0.2 + Math.random() * 0.15,
      MOCAT: 0.3 + Math.random() * 0.15,
      BUN: 0.15 + Math.random() * 0.1,
      DITT: 0.25 + Math.random() * 0.1,
    };
  });

  return {
    points,
    coins: [
      { id: "LAG", name: "Lag Girl", color: "#ff6b9d" },
      { id: "MOCAT", name: "Mocaccino Cat", color: "#8884d8" },
      { id: "BUN", name: "Bun Protocol", color: "#ffc658" },
      { id: "DITT", name: "DittoDAO", color: "#e072c8" },
    ],
  };
};

export default function RoundsAPage() {
  // 最初のmemeを安全に取得
  const firstMeme = mockmemes.length > 0 ? mockmemes[0] : null;

  // 最初は1つ目のmemeを選択（存在しない場合はデフォルト）
  const [selectedCoin, setSelectedCoin] = useState<RoundCoin>(
    firstMeme ? memeToRoundCoin(firstMeme) : defaultCoin,
  );

  // ドミナンスチャートデータ
  const dominanceData = createMockDominanceData();

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

  const fallbackData: OHLCData[] = [];
  const currentPrice =
    priceData && priceData.length > 0
      ? (priceData[priceData.length - 1]?.close ?? 0)
      : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* ヘッダー部分 */}
      <div className="border-b border-gray-800 py-3">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white text-center">
            Battle Round 12
          </h1>
        </div>
      </div>

      {/* メインコンテンツ部分 - 2カラム */}
      <div className="grid grid-cols-2 flex-1">
        {/* 中央カラム - チャートとギャラリー */}
        <div className="overflow-y-auto">
          <div className="p-4">
            {/* 価格チャート */}
            <div className="mb-6">
              <Card className="bg-black/20 backdrop-blur-sm border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-white">
                    Price Chart
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
                      height={250}
                      className="mt-3"
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ドミナンスチャート */}
            <div className="mb-6">
              <Card className="bg-black/20 backdrop-blur-sm border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-white">
                    Dominance Chart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DominanceChart
                    data={dominanceData}
                    height={200}
                    volume="$66K Vol."
                    date="Round 12"
                    compact
                  />
                </CardContent>
              </Card>
            </div>

            {/* ギャラリー部分 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Meme Gallery
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {mockmemes.slice(0, 4).map((meme, i) => (
                  <button
                    key={meme.symbol}
                    onClick={() => setSelectedCoin(memeToRoundCoin(meme))}
                    className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-xl bg-transparent border-none p-0"
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
              <div className="mt-3 grid grid-cols-2 gap-3">
                {mockmemes.slice(4, 8).map((meme, i) => (
                  <button
                    key={meme.symbol}
                    onClick={() => setSelectedCoin(memeToRoundCoin(meme))}
                    className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-xl bg-transparent border-none p-0"
                    aria-pressed={selectedCoin.symbol === meme.symbol}
                    type="button"
                  >
                    <RoundsACard
                      imageUrl={meme.iconUrl}
                      symbol={meme.symbol}
                      name={meme.name}
                      percent={i % 2 === 0 ? "0.9%" : "13%"}
                      rank={i + 5}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右カラム - SwapUIとチャット */}
        <div className="border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <SwapUI coin={selectedCoin} />
          </div>
          <div className="flex-1">
            <CommunicationPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
