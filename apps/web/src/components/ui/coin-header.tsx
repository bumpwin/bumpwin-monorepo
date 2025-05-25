import type { RoundCoin } from "@/types/roundcoin";
import Image from "next/image";

interface CoinHeaderProps {
  coin: RoundCoin;
  variant?: "default" | "champion";
}

export const CoinHeader = ({ coin, variant = "default" }: CoinHeaderProps) => {
  const isChampion = variant === "champion";

  // Shadow and border styles based on variant
  const containerStyles = isChampion
    ? "border border-yellow-400/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]"
    : "border border-purple-500/20 shadow-[0_0_15px_rgba(149,76,233,0.1)]";

  // Text color and effects based on variant
  const textStyles = isChampion
    ? "text-yellow-400 drop-shadow-[0_0_5px_rgba(255,215,0,0.2)]"
    : "text-white";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative w-12 h-12 rounded-xl overflow-hidden ${containerStyles}`}
      >
        <Image
          src={coin.iconUrl}
          alt={coin.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-bold text-xl truncate ${textStyles}`}>
          {coin.name}
        </div>
      </div>
    </div>
  );
};
