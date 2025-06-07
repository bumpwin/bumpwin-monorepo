"use client";

import DarknightSwapUI from "@/components/trading/swap/variants/DarknightSwapUI";
import DaytimeSwapUI from "@/components/trading/swap/variants/DaytimeSwapUI";
import { useBattleClock } from "@/providers/BattleClockProvider";
import type { CoinWithRound } from "@/types/coin-with-round";

interface SwapUIProps {
  coin?: CoinWithRound;
  variant?: "default" | "champion";
}

const SwapUI: React.FC<SwapUIProps> = ({ coin, variant = "default" }) => {
  const { phase } = useBattleClock();

  return phase === "daytime" ? (
    <DaytimeSwapUI coin={coin} variant={variant} />
  ) : (
    <DarknightSwapUI />
  );
};

export default SwapUI;
