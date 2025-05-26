import { CoinIconSymbol } from "@/components/ui/coin-icon-symbol";
import type { MemeMetadata } from "@workspace/types";

interface CoinHeaderProps {
  coin?: MemeMetadata & { round?: number };
  variant?: "default" | "champion";
}

export const CoinHeader = ({ coin }: CoinHeaderProps) => {
  return (
    <div className="flex items-center justify-start">
      {coin && <CoinIconSymbol coin={coin} size={32} />}
    </div>
  );
};
