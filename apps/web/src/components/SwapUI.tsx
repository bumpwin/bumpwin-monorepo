"use client";

import { useBattleRoundPhase } from "@/app/providers/BattleRoundPhaseProvider";
import type { RoundCoin } from "@/types/roundcoin";
import DarknightSwapUI from "./DarknightSwapUI";
import DaytimeSwapUI from "./DaytimeSwapUI";

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
