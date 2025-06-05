import { CoinIconSymbol } from "@/components/coins/coin-icon-symbol";
import type { ComponentType, ToggleSide } from "@/components/trading/swap/elements/types";
import type { RoundCoin } from "@/types/roundcoin";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { match } from "ts-pattern";

interface PotentialWinDisplayProps {
  amount: number | null;
  potentialWin: number;
  activeSide: ToggleSide;
  coin?: RoundCoin;
  avgPrice: number;
  componentType: ComponentType;
}

export const PotentialWinDisplay = ({
  amount,
  potentialWin,
  activeSide,
  coin,
  avgPrice,
  componentType,
}: PotentialWinDisplayProps) => {
  // Only render if there's an amount greater than 0
  if (!amount || amount <= 0) return null;

  // Default SUI coin if needed
  const suiCoin = { iconUrl: "/images/SUI.png", symbol: "SUI" } as RoundCoin;

  // RACC coin for darknight mode
  const raccCoin = {
    iconUrl: "/images/mockmemes/RACC.webp",
    symbol: "RACC",
    name: "Raccoon Moon",
    id: "0x0000000000000000000000000000000000000000000000000000000000000009",
    round: 0,
    share: 0,
    marketCap: 0,
    description: "",
  } as RoundCoin;

  // Determine which coin to show based on componentType and activeSide
  const displayCoin = (() => {
    if (componentType === "daytime") return suiCoin;
    if (componentType === "darknight" && activeSide === "buy") return coin ?? suiCoin;
    if (componentType === "darknight" && activeSide === "switch") return raccCoin;
    if (componentType === "champion" && activeSide === "buy") return coin ?? suiCoin;
    return suiCoin;
  })();

  // Determine if we should show the unit symbol based on componentType and activeSide
  const showUnitSymbol = (() => {
    if (componentType === "daytime") return true;
    if (componentType === "darknight") return false;
    if (componentType === "champion" && activeSide === "sell") return true;
    if (componentType === "champion" && activeSide === "buy") return false;
    return true;
  })();

  // Special case for Daytime
  const isDaytime = componentType === "daytime";

  const labelText = isDaytime && activeSide === "buy" ? "To win 🌻" : "To receive";

  // Text color for amounts in Daytime
  const amountTextColor = isDaytime && activeSide === "buy" ? "text-[#00E065]" : "text-white";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0, y: -10 }}
        animate={{ height: "auto", opacity: 1, y: 0 }}
        exit={{ height: 0, opacity: 0, y: -10 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          duration: 0.3,
        }}
        className="overflow-hidden"
      >
        <div className="mb-4 border-[#2D3244] border-t py-4">
          {isDaytime ? (
            // Daytime特有のレイアウト - 左にラベル、右に緑色テキスト
            <div className="flex cursor-not-allowed items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-400">{labelText}</span>
              </div>
              <div className="flex items-baseline justify-end px-3">
                <span className={`${amountTextColor} font-bold text-4xl`}>
                  {potentialWin.toFixed(2)}
                </span>
                <span className={`ml-2 ${amountTextColor} select-none font-bold text-xl`}>SUI</span>
              </div>
            </div>
          ) : (
            // Darknight/Champion向けの元のレイアウト
            <>
              <div className="mb-2 cursor-not-allowed font-medium text-gray-400 text-sm">
                {labelText}
              </div>
              <div className="flex cursor-not-allowed items-baseline px-3">
                <CoinIconSymbol
                  coin={displayCoin}
                  size="sm"
                  className="mr-1 min-w-0 flex-shrink-0"
                />
                <div className="flex flex-1 items-baseline justify-end">
                  <span className="font-bold text-4xl text-white">{potentialWin.toFixed(2)}</span>
                  <span
                    className={`ml-2 font-bold text-white text-xl select-none${!showUnitSymbol ? " invisible" : ""}`}
                  >
                    {displayCoin.symbol === "RACC" ? "RACC" : "SUI"}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="mt-1.5 flex cursor-not-allowed items-center gap-1 text-gray-500 text-xs">
            <span>Avg. Price {avgPrice.toFixed(1)}¢</span>
            <Info className="h-3 w-3 cursor-not-allowed" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
