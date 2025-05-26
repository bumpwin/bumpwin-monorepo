import { CoinIconSymbol } from "@/components/ui/coin-icon-symbol";
import type { BattleCoin } from "@/types/battle";

interface CoinHeaderProps {
  coin: BattleCoin;
  variant?: "default" | "champion";
}

export const CoinHeader = ({ coin, variant = "default" }: CoinHeaderProps) => {
  const isChampion = variant === "champion";

  return (
    <div
      className={`flex items-center gap-2 ${isChampion ? "justify-center" : ""}`}
    >
      <CoinIconSymbol coin={coin} size={isChampion ? 40 : 32} />
      <div className="flex flex-col">
        <span className="text-sm text-gray-400">Price</span>
        <span className="text-lg font-medium text-white">
          ${coin.price.toFixed(6)}
        </span>
      </div>
    </div>
  );
};
