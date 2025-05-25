import { CoinIconSymbol } from "@/components/ui/coin-icon-symbol";
import type { RoundCoin } from "@/types/roundcoin";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import type { ComponentType } from "./amount-input";
import type { ToggleSide } from "./toggle-button";

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

  // Determine which coin to show based on componentType and activeSide
  const displayCoin = (() => {
    if (componentType === "daytime") {
      return suiCoin; // 仕様: Daytime常にSUI
    }

    if (componentType === "darknight") {
      if (activeSide === "buy") {
        return coin ?? suiCoin; // Dark .buy .receive 無印 (コイン表示)
      }
      return suiCoin; // その他の場合はSUI
    }

    if (componentType === "champion") {
      if (activeSide === "buy") {
        return coin ?? suiCoin; // champ .buy .receive 無印 (コイン表示)
      }
      return suiCoin; // champ.sell .receve SUI
    }

    return coin ?? suiCoin;
  })();

  // Determine if we should show the unit symbol based on componentType and activeSide
  const showUnitSymbol = (() => {
    if (componentType === "daytime") {
      return true; // 仕様: Daytime常にSUI表示
    }

    if (componentType === "darknight") {
      return false; // 仕様: dark .buy/switch .receive すべて無印
    }

    if (componentType === "champion") {
      if (activeSide === "sell") {
        return true; // 仕様: champ.sell .receve SUI
      }
      return false; // 仕様: champ .buy .receive 無印
    }

    return true;
  })();

  // Determine the label text based on activeSide and componentType
  const labelText = (() => {
    if (componentType === "champion" && activeSide === "buy") {
      return "To receive";
    }

    return activeSide === "buy" ? "To win 🌻" : "To receive";
  })();

  // Special case for Daytime
  const isDaytime = componentType === "daytime";

  // Text color for amounts in Daytime
  const amountTextColor = isDaytime ? "text-[#00E065]" : "text-white";

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
        <div className="border-t border-[#2D3244] py-4 mb-4">
          {isDaytime ? (
            // Daytime特有のレイアウト - 左にラベル、右に緑色テキスト
            <div className="flex justify-between items-center cursor-not-allowed">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">{labelText}</span>
              </div>
              <div className="flex items-baseline justify-end px-3">
                <span className={`${amountTextColor} text-4xl font-bold`}>
                  {potentialWin.toFixed(2)}
                </span>
                <span
                  className={`ml-2 ${amountTextColor} text-xl font-bold select-none`}
                >
                  {displayCoin.symbol}
                </span>
              </div>
            </div>
          ) : (
            // Darknight/Champion向けの元のレイアウト
            <>
              <div className="text-gray-400 font-medium text-sm mb-2 cursor-not-allowed">
                {labelText}
              </div>
              <div className="flex items-baseline px-3 cursor-not-allowed">
                <CoinIconSymbol
                  coin={displayCoin}
                  size="sm"
                  className="mr-1 min-w-0 flex-shrink-0"
                />
                <div className="flex items-baseline justify-end flex-1">
                  <span className="text-white text-4xl font-bold">
                    {potentialWin.toFixed(2)}
                  </span>
                  <span
                    className={`ml-2 text-white text-xl font-bold select-none${!showUnitSymbol ? " invisible" : ""}`}
                  >
                    {displayCoin.symbol}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-1 mt-1.5 text-gray-500 text-xs cursor-not-allowed">
            <span>Avg. Price {avgPrice.toFixed(1)}¢</span>
            <Info className="h-3 w-3 cursor-not-allowed" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
