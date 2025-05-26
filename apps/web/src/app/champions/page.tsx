"use client";

import { ChampionCard } from "@/components/ChampionCard";
import { useQuery } from "@tanstack/react-query";
import type { MemeMarketData, MemeMetadata } from "@workspace/types";
import React from "react";

export default function ChampionsPage() {
  // Fetch champions from API
  const {
    data: champions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["champions"],
    queryFn: async () => {
      const res = await fetch("/api/champions");
      if (!res.ok) throw new Error("Failed to fetch champions");
      const data = await res.json();
      console.log("Champions data:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Error: {(error as Error).message}</div>
      </div>
    );
  }

  if (!champions || champions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">No champions found</div>
      </div>
    );
  }

  return (
    <>
      {/* Champions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10">
        {champions?.map((champion: { meme: MemeMetadata & MemeMarketData | null; round: { round: number } }) => 
          champion.meme ? (
            <ChampionCard
              key={champion.meme.id}
              imageUrl={champion.meme.iconUrl}
              symbol={champion.meme.symbol}
              name={champion.meme.name}
              mcap={champion.meme.marketCap || 0}
              round={champion.round?.round}
            />
          ) : null
        )}
      </div>
    </>
  );
}
