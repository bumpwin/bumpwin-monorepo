"use client";

import { useChampions } from "@/hooks";
import type { UIRoundCoinData } from "@/types/ui-types";
import { notFound } from "next/navigation";
import { ChampionDetailPage } from "./ChampionDetailPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    return <ChampionPageClient id={id} />;
  });
}

function ChampionPageClient({ id }: { id: string }) {
  const { data: champions = [], isLoading } = useChampions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white text-xl">Loading champion...</div>
      </div>
    );
  }

  const champion = champions.find((c) => c.round.round.toString() === id);
  if (!champion || !champion.meme) return notFound();

  const coin: UIRoundCoinData = {
    id: champion.meme.id,
    round: champion.round.round,
    symbol: champion.meme.symbol,
    name: champion.meme.name,
    iconUrl: champion.meme.iconUrl,
    description: champion.meme.description,
    price: 0.1, // Add required price property
    marketCap: 100000,
    share: 40,
  };

  return <ChampionDetailPage coin={coin} id={id} />;
}
