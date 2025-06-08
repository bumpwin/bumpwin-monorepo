"use client";

import { UnifiedDisplayCard } from "@/components/coins/UnifiedDisplayCard";
import type { UIRoundCoinData } from "@/types/ui-types";
import { mapChampionCardProps } from "@/utils/propMappers";

type ChampionCoinCardProps = UIRoundCoinData;

export function ChampionCoinCard(props: ChampionCoinCardProps) {
  return <UnifiedDisplayCard {...mapChampionCardProps(props)} />;
}
