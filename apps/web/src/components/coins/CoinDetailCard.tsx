"use client";

import { UnifiedDisplayCard } from "@/components/coins/UnifiedDisplayCard";
import type { UIRoundCoinData } from "@/types/ui-types";

interface CoinDetailCardProps {
  coin: UIRoundCoinData & {
    websiteLink?: string;
    telegramLink?: string;
    twitterLink?: string;
  };
  variant?: "default" | "champion";
}

export const CoinDetailCard: React.FC<CoinDetailCardProps> = ({ coin }) => {
  return (
    <UnifiedDisplayCard
      variant="detail"
      {...coin}
      websiteLink={coin.websiteLink}
      telegramLink={coin.telegramLink}
      twitterLink={coin.twitterLink}
    />
  );
};
