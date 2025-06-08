"use client";

import { UnifiedDisplayCard } from "@/components/coins/UnifiedDisplayCard";
import type { UIRoundCoinData } from "@/types/ui-types";

interface BattleCoinDetailCardProps {
  coin: UIRoundCoinData;
}

const BattleCoinDetailCard: React.FC<BattleCoinDetailCardProps> = ({ coin }) => {
  return <UnifiedDisplayCard variant="battle" {...coin} />;
};

export default BattleCoinDetailCard;
