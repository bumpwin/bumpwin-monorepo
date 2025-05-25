import type { RoundCoin } from "@/types/roundcoin";
import Image from "next/image";

interface CoinIconSymbolProps {
  coin?: RoundCoin;
  size?: "sm" | "md";
  className?: string;
}

export const CoinIconSymbol = ({
  coin,
  size = "md",
  className = "",
}: CoinIconSymbolProps) => {
  if (!coin) return null;

  const iconSize = size === "sm" ? "w-7 h-7" : "w-12 h-12";
  const textSize = size === "sm" ? "text-lg" : "text-xl";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${iconSize} relative overflow-hidden rounded-md`}>
        <Image
          src={coin.iconUrl}
          alt={coin.symbol}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <span className={`font-bold ${textSize} text-white select-none truncate`}>
        {coin.symbol}
      </span>
    </div>
  );
};
