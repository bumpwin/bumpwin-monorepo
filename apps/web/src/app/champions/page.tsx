"use client";

import { ChampionCard } from "@/components/ChampionCard";
import { mockChampionCoinMetadata } from "@/mock/mockData";
import type { ChampionCoin } from "@/types/champion";
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
      share: coin.share, // use real share if needed
      marketCap: coin.marketCap, // use real marketCap
    }),
  );

  return (
    <main className="flex-1 overflow-y-auto pb-6 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden">
          {/* バックグラウンドエフェクト */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-500/20 to-transparent opacity-60 blur-2xl" />

          <h1
            className="text-5xl font-extrabold text-center mb-14 tracking-tight z-10 relative drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]"
            style={{
              background:
                "linear-gradient(90deg, #FFD700 0%, #FFEB80 50%, #FFC700 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            HALL OF CHAMPIONS
          </h1>

          <div className="mt-6 text-center font-bold">
            <span
              className="text-2xl bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-transparent tracking-wider"
              style={{ textShadow: "0 0 10px rgba(253, 224, 71, 0.6)" }}
            >
              The greatest champions of the Battle Royale
            </span>
          </div>
        </div>

        {/* Champions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10">
          {championCoins.map((champion) => (
            <ChampionCard
              key={champion.id}
              imageUrl={champion.iconUrl}
              symbol={champion.symbol}
              name={champion.name}
              mcap={champion.marketCap}
              round={champion.round}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
