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
    <>
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
    </>
  );
}
