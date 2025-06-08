"use client";

import type { CoinCardProps } from "@/types/coin";
import { mapCoinCardProps } from "@/utils/propMappers";
import { UnifiedDisplayCard } from "./UnifiedDisplayCard";

export function CoinCard(props: CoinCardProps) {
  return <UnifiedDisplayCard {...mapCoinCardProps(props)} />;
}
