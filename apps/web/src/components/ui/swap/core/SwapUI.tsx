"use client";

import { useBattleRoundPhase } from "@/app/providers/BattleRoundPhaseProvider";
import DarknightSwapUI from "@/components/ui/swap/variants/DarknightSwapUI";
import DaytimeSwapUI from "@/components/ui/swap/variants/DaytimeSwapUI";
import type { RoundCoin } from "@/types/roundcoin";

interface SwapUIProps {
  coin?: RoundCoin;
  variant?: "default" | "champion";
}

const SwapUI: React.FC<SwapUIProps> = ({ coin, variant = "default" }) => {
  const { phase } = useBattleRoundPhase();

  return phase === "daytime" ? (
    <DaytimeSwapUI coin={coin} variant={variant} />
  ) : (
    <DarknightSwapUI />
  );
};

export default SwapUI;
