"use client";

import { api } from "@/app/client";
import { ChampionCard } from "@/components/ChampionCard";
import { useQuery } from "@tanstack/react-query";
import type { MemeMetadata } from "@workspace/types";

// Champion API types
interface Champion {
  meme?: MemeMetadata;
  round?: {
    round: number;
  };
}

export default function ChampionsPage() {
  // Fetch champions from API
  const {
    data: champions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["champions"],
    queryFn: async () => {
      const res = await api.champions.$get();
      const data = await res.json();
      console.log("Champions data:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-blue-500 border-t-4 border-b-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-red-500">Error: {(error as Error).message}</div>
      </div>
    );
  }

  if (!champions || champions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">No champions found</div>
      </div>
    );
  }

  return (
    <>
      {/* Champions Grid */}
      <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {(champions as Champion[])?.map((champion) =>
          champion.meme ? (
            <ChampionCard
              key={champion.meme.id}
              imageUrl={champion.meme.iconUrl}
              symbol={champion.meme.symbol}
              name={champion.meme.name}
              mcap={0}
              round={champion.round?.round}
            />
          ) : null,
        )}
      </div>
    </>
  );
}
