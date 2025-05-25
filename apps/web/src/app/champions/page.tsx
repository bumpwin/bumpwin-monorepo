"use client";

import { ChampionCard } from "@/components/ChampionCard";
import { mockChampionCoinMetadata } from "@/mock/mockData";
import type { CoinCardProps } from "@/types/coincard";
import React from "react";

export default function ChampionsPage() {
  // Transform mockChampionCoinMetadata to CoinCardProps type
  const championCoins: CoinCardProps[] = mockChampionCoinMetadata.map(
    (coin) => ({
      address: coin.id.toString(),
      round: coin.round ?? 1,
      name: coin.name,
      symbol: coin.symbol,
      logoUrl: coin.iconUrl,
      description: coin.description,
      telegramLink: coin.telegramLink,
      websiteLink: coin.websiteLink,
      twitterLink: coin.twitterLink,
      share: coin.share,
      marketCap: coin.marketCap ?? 0,
      isFavorite: false,
    }),
  );

  return (
    <>
      {/* Champions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10">
        {championCoins.map((champion) => (
          <ChampionCard
            key={champion.address}
            imageUrl={champion.logoUrl}
            symbol={champion.symbol}
            name={champion.name}
            mcap={champion.marketCap ?? 0}
            round={champion.round ?? 1}
          />
        ))}
      </div>
    </>
  );
}
