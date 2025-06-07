import type { CoinWithRound } from "@/types/coin-with-round";
import Image from "next/image";

interface CoinIconSymbolProps {
  coin?: CoinWithRound;
  size?: "sm" | "md";
  className?: string;
}

export const CoinIconSymbol = ({ coin, size = "md", className = "" }: CoinIconSymbolProps) => {
  if (!coin) return null;

  const iconSize = size === "sm" ? "w-7 h-7" : "w-12 h-12";
  const textSize = size === "sm" ? "text-lg" : "text-xl";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${iconSize} relative overflow-hidden rounded-md`}>
        <Image src={coin.iconUrl} alt={coin.symbol} fill className="rounded-md object-cover" />
      </div>
      <span className={`font-bold ${textSize} select-none truncate text-white`}>{coin.symbol}</span>
    </div>
  );
};
