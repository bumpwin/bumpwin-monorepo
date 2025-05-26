import type { BattleCoin } from "@/types/battle";
import Image from "next/image";

interface CoinIconSymbolProps {
  coin?: BattleCoin;
  size?: number;
}

export const CoinIconSymbol = ({ coin, size = 24 }: CoinIconSymbolProps) => {
  if (!coin) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src={coin.iconUrl}
          alt={coin.symbol}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <span className="text-white font-medium">{coin.symbol}</span>
    </div>
  );
};
