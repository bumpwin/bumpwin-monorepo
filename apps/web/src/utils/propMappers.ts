import type { BaseCoinDisplayProps, CoinCardProps } from "@/types/coin";
import type { UIRoundCoinData } from "@/types/ui-types";

/**
 * Map CoinCardProps to BaseCoinDisplayProps for the list variant
 */
export function mapCoinCardProps(props: CoinCardProps): BaseCoinDisplayProps {
  return {
    id: props.id,
    symbol: props.symbol,
    name: props.name,
    description: props.description,
    iconUrl: props.iconUrl,
    variant: "list",
    marketCap: props.marketCap,
    price: props.price,
    priceChange24h: props.priceChange24h,
    priceChangePercentage24h: props.priceChangePercentage24h,
    volume24h: props.volume24h,
    high24h: props.high24h,
    low24h: props.low24h,
    createdAt: props.createdAt,
    isFavorite: props.isFavorite,
    onToggleFavorite: props.onToggleFavorite,
    showFavorite: !!props.onToggleFavorite,
  };
}

/**
 * Map UIRoundCoinData to BaseCoinDisplayProps for the champion variant
 */
export function mapChampionCardProps(
  props: UIRoundCoinData & {
    showRound?: boolean;
    className?: string;
  },
): BaseCoinDisplayProps {
  return {
    id: props.id,
    symbol: props.symbol,
    name: props.name,
    description: props.description,
    iconUrl: props.iconUrl,
    variant: "champion",
    marketCap: props.marketCap,
    price: props.price,
    round: props.round,
    share: props.share,
    showRound: props.showRound ?? true,
    className: props.className,
  };
}
