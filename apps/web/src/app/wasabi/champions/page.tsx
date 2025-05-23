"use client";

import { ChampionsList } from "@/components/Champions";
import { ResultView } from "@/components/ResultView";
import {
  mockChampionCoinMetadata,
  mockDominanceChartData,
  mockLastChampionCoinMetadata,
} from "@/mock/mockData";
import type { ChampionCoin } from "@/types/champion";
import type { DominanceChartData, DominancePoint } from "@/types/dominance";
import React from "react";

export default function ChampionsPage() {
  // Transform mockChampionCoinMetadata to ChampionCoin type
  const championCoins: ChampionCoin[] = mockChampionCoinMetadata.map(
    (coin) => ({
      id: coin.id.toString(),
      round: coin.round,
      name: coin.name,
      symbol: coin.symbol,
      iconUrl: coin.iconUrl,
      description: coin.description,
      telegramLink: coin.telegramLink,
      websiteLink: coin.websiteLink,
      twitterLink: coin.twitterLink,
      share: 0.35, // Mock data
      marketCap: 1000000, // Mock data
    }),
  );

  // Transform mockDominanceChartData to DominanceChartData type
  const dominanceData: DominanceChartData = {
    points: mockDominanceChartData.map((point) => {
      const dominancePoint: DominancePoint = {
        date: new Date(point.timestamp * 1000).toISOString(),
      };
      // Add each coin's share as a property
      point.shares.forEach((share, index) => {
        const coin = championCoins[index];
        if (coin) {
          dominancePoint[coin.symbol.toLowerCase()] = share / 100; // Convert percentage to decimal
        }
      });
      return dominancePoint;
    }),
    coins: championCoins.map((coin) => ({
      id: coin.id,
      name: coin.name,
      color: "#FFD700", // Mock color
    })),
  };

  return (
    <div className="relative flex min-h-[calc(100vh-var(--header-height))]">
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-6 p-4">
          {/* Title Section */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex items-center gap-2">
              <h1
                className="text-4xl md:text-6xl font-extrabold bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(255,255,180,0.35)] relative"
                style={{
                  WebkitTextStroke: "1px #fff9",
                  letterSpacing: "0.02em",
                }}
              >
                CHAMPIONS <span className="align-middle" />
                <span
                  className="absolute left-0 right-0 top-0 h-1/3 bg-white/60 rounded-full blur-md pointer-events-none"
                  style={{ zIndex: 1 }}
                />
              </h1>
            </div>
            <div className="mt-4 text-center text-gray-300 text-xl font-medium drop-shadow-lg">
              The greatest coins of all time
            </div>
          </div>

          {/* Result View */}
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-lg">
            <ResultView
              coin={{
                ...mockLastChampionCoinMetadata,
                id: mockLastChampionCoinMetadata.id.toString(),
              }}
              forceVisible={true}
            />
          </div>

          {/* Champions List */}
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-lg">
            <ChampionsList
              coins={championCoins}
              dominanceData={dominanceData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
