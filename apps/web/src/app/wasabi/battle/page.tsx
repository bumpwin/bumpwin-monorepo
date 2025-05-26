"use client";

import { ChampionCoinList } from "@/components/ChampionCoinList";
// import DominanceChart from "@/components/DominanceChart";
import DominanceRechart from "@/components/DominanceRechart";
// import { mockDominanceData } from "@/mock/mockDominanceData";
import type { CoinMeta } from "@/components/DominanceRechart";
import RoundCoinTable from "@/components/RoundCoinTable";
import SwapUI from "@/components/ui/swap/core/SwapUI";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";
import type { CoinCardProps } from "@/types/coincard";
import {
  prepareCoinsMetadata,
  prepareMultiCoinChartData,
} from "@/utils/chartDataPreparation";
import type { MemeMetadata } from "@workspace/types";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedCoin, setSelectedCoin] = useState<MemeMetadata | undefined>(
    undefined,
  );

  // データ準備ロジックをユーティリティ関数で実装
  // Add color field to match CoinMeta interface
  const coinMetaWithColors: CoinMeta[] = mockCoinMetadata.map(
    (coin, index) => ({
      id: Number(coin.id) || index,
      symbol: coin.symbol,
      name: coin.name,
      color: `hsl(${(index * 360) / mockCoinMetadata.length}, 70%, 50%)`,
    }),
  );
  const relevantCoins = prepareCoinsMetadata(coinMetaWithColors);
  const rechartPoints = prepareMultiCoinChartData(
    mockDominanceChartData,
    relevantCoins,
  );

  const handleCoinSelect = (coin: CoinCardProps | undefined) => {
    if (!coin) {
      setSelectedCoin(undefined);
      return;
    }
    // Find the corresponding MemeMetadata from mockCoinMetadata
    const memeMetadata = mockCoinMetadata.find((m) => m.id === coin.address);
    if (memeMetadata) {
      setSelectedCoin(memeMetadata);
    } else {
      setSelectedCoin(undefined);
    }
  };

  // 単一コイン用のデータ
  // const firstCoinFromMeta = relevantCoins[0];
  // const singleCoinMetaForChart = firstCoinFromMeta ? [firstCoinFromMeta] : [];
  // const singleCoinRechartPoints = prepareSingleCoinChartData(mockDominanceChartData, firstCoinFromMeta);

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col">
      {/* <InfoBar /> */}
      <div className="flex flex-1">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto pb-6">
          {/* Hero Banner Section - さらに横長のアスペクト比に変更 */}
          <div className="w-full overflow-hidden relative aspect-[48/7] mb-4">
            <Image
              src="/hero.png"
              alt="BUMP.WIN - Meme Coin Battle Royale"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Dominance Chart Section */}
          {/* <div className="px-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <DominanceChart
                data={mockDominanceData}
                height={320}
                volume="$6,396,866 Vol."
                date="Jun 18, 2025"
              />
            </div>
          </div> */}

          {/* New DominanceRechart Section */}
          <div className="px-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <DominanceRechart
                points={rechartPoints}
                coins={relevantCoins}
                height={300} // Adjusted height for multi-line chart
              />
            </div>
          </div>

          {/* Single Coin DominanceRechart Section */}
          {/* <div className="px-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <DominanceRechart
                points={singleCoinRechartPoints}
                coins={singleCoinMetaForChart}
                height={200}
                hideLegend={true}
              />
            </div>
          </div> */}

          {/* Round Coin Table Section */}
          <div className="px-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
              <div className="flex-1 min-w-0 flex flex-col justify-start">
                <RoundCoinTable
                  onSelectCoin={handleCoinSelect}
                  selectedCoinId={selectedCoin?.id}
                />
              </div>
              <div className="w-full lg:w-[340px] flex-shrink-0 flex items-start lg:items-end">
                <div className="w-full self-start mt-12">
                  <SwapUI coin={selectedCoin} />
                </div>
              </div>
            </div>
          </div>

          {/* Previous Champions Section */}
          <div className="mb-6">
            <ChampionCoinList />
          </div>

          {/* Current Round Contestants */}
          {/* <div id="current-round">
            <CoinList />
          </div> */}
        </main>
      </div>
    </div>
  );
}
