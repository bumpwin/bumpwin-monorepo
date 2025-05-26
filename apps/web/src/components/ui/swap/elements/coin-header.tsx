import { CoinIconSymbol } from "@/components/ui/coin-icon-symbol";
import { getMemeMarketData } from "@/mock/mockData";
import type { MemeMetadata } from "@workspace/types";

interface CoinHeaderProps {
  coin?: MemeMetadata & { round?: number };
  variant?: "default" | "champion";
}

export const CoinHeader = ({ coin, variant = "default" }: CoinHeaderProps) => {
  const marketData = coin ? getMemeMarketData(coin.id) : undefined;
  const isChampion = variant === "champion";

  return (
    <div
      className={`flex items-center gap-2 ${isChampion ? "justify-center" : ""}`}
    >
      {coin && <CoinIconSymbol coin={coin} size={isChampion ? 40 : 32} />}
      <div className="flex flex-col">
        <span className="text-sm text-gray-400">Price</span>
        <span className="text-lg font-medium text-white">
          ${marketData?.price.toFixed(6) || "0.000000"}
        </span>
      </div>
    </div>
  );
};
