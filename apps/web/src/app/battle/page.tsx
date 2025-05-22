"use client";

import { mockprice } from "@/app/client";
import CommunicationPanel from "@/components/CommunicationPanel";
import InfoBar from "@/components/InfoBar";
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
import { useState } from "react";
import { RoundsACard } from "./RoundsACard";

// mockmemesをRoundCoin型に変換する関数
function memeToRoundCoin(meme: MockCoinMetaData): RoundCoin {
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
}

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

  const fallbackData: OHLCData[] = [];
  const currentPrice =
    priceData && priceData.length > 0
      ? (priceData[priceData.length - 1]?.close ?? 0)
      : 0;

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex flex-1">
        {/* 左カラム - チャートと情報 */}
        <main className="flex-1 border-r border-gray-700 bg-gray-900/30">
          <div className="h-full flex flex-col">
            {/* 固定部分: InfoBarとタイトル */}
            <div className="flex-none px-4 pt-4">
              <InfoBar />
              <h1 className="text-4xl font-extrabold text-white mb-6 mt-4 text-center tracking-tight drop-shadow-lg">
                Battle Round 12
              </h1>
            </div>

            {/* スクロール可能部分: Price Chartから下 */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 pb-6">
                <Card className="w-full bg-black/20 backdrop-blur-sm border-none mb-4">
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
                        height={400}
                        className="mt-3"
                      />
                    )}
                  </CardContent>
                </Card>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Market Cap</div>
                    <div className="text-xl font-bold text-white">$180.09K</div>
                  </div>
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Volume</div>
                    <div className="text-xl font-bold text-white">$66K</div>
                  </div>
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Meme Count</div>
                    <div className="text-xl font-bold text-white">24</div>
                  </div>
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Trader Count</div>
                    <div className="text-xl font-bold text-white">119</div>
                  </div>
                </div>

                <h2 className="text-3xl font-extrabold text-white my-6 text-center tracking-tight drop-shadow-lg">
                  Rounds-A Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mockmemes.map((meme, i) => (
                    <button
                      key={meme.symbol}
                      onClick={() => setSelectedCoin(memeToRoundCoin(meme))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setSelectedCoin(memeToRoundCoin(meme));
                      }}
                      tabIndex={0}
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
              </div>
            </div>
          </div>
        </main>

        {/* 中央カラム - Swap UI */}
        <aside className="w-96 border-l border-r border-gray-700 bg-gray-800/30 overflow-hidden">
          <div className="p-4">
            <SwapUI coin={selectedCoin} />
          </div>
        </aside>

        {/* 右側チャット欄 */}
        <aside className="w-96 border-l border-gray-700 bg-gray-900/50 overflow-hidden">
          <CommunicationPanel />
        </aside>
      </div>
    </div>
  );
}
