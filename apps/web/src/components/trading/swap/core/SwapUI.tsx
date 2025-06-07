"use client";

import DarknightSwapUI from "@/components/trading/swap/variants/DarknightSwapUI";
import DaytimeSwapUI from "@/components/trading/swap/variants/DaytimeSwapUI";
import { useBattleClock } from "@/providers/BattleClockProvider";
import type { UIRoundCoinData } from "@/types/ui-types";

interface SwapUIProps {
  coin?: UIRoundCoinData;
  variant?: "default" | "champion";
}

const SwapUI: React.FC<SwapUIProps> = ({ coin, variant = "default" }) => {
  const { phase } = useBattleClock();

  return phase === "daytime" ? (
    <DaytimeSwapUI coin={coin} variant={variant} />
  ) : (
    <DarknightSwapUI coin={coin} variant={variant} />
  );
};

export default SwapUI;
