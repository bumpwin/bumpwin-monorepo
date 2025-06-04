"use client";

import { ChampionCoinList } from "@/components/ChampionCoinList";
// import DominanceChart from "@/components/DominanceChart";
import DominanceRechart from "@/components/DominanceRechart";
// import { mockDominanceData } from "@/mock/mockDominanceData";
import type { CoinMeta } from "@/components/DominanceRechart";
import RoundCoinTable from "@/components/RoundCoinTable";
import SwapUI from "@/components/ui/swap/core/SwapUI";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";
import type { RoundCoin } from "@/types/roundcoin";
import { prepareCoinsMetadata, prepareMultiCoinChartData } from "@/utils/chartDataPreparation";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedCoin, setSelectedCoin] = useState<RoundCoin | undefined>(undefined);

  // データ準備ロジックをユーティリティ関数で実装
  const relevantCoins = prepareCoinsMetadata(mockCoinMetadata as CoinMeta[]);
  const rechartPoints = prepareMultiCoinChartData(mockDominanceChartData, relevantCoins);

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
          <div className="relative mb-4 aspect-[48/7] w-full overflow-hidden">
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
          <div className="mb-8 px-4">
            <div className="rounded-lg bg-white/5 p-4 shadow-lg backdrop-blur-sm">
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
          <div className="mb-8 px-4">
            <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
              <div className="flex min-w-0 flex-1 flex-col justify-start">
                <RoundCoinTable onSelectCoin={setSelectedCoin} selectedCoinId={selectedCoin?.id} />
              </div>
              <div className="flex w-full flex-shrink-0 items-start lg:w-[340px] lg:items-end">
                <div className="mt-12 w-full self-start">
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
