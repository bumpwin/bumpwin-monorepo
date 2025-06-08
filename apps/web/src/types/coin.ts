import type { MemeMetadata } from "@workspace/types";
import type { UIMemeMetadata } from "./ui-types";

// Simplified coin detail - based on MemeMetadata + market data
export interface CoinDetailData extends MemeMetadata {
  address: string;
  logoUrl: string; // Alias for iconUrl for compatibility
  marketCap: number;
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  createdAt: Date;
  isFavorite: boolean;
}

// Coin card props - used for coin listings
export interface CoinCardProps extends MemeMetadata {
  address: string;
  marketCap: number;
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  createdAt: Date;
  isFavorite: boolean;
  onToggleFavorite?: (address: string) => void;
}

// Base props for unified coin display components
export interface BaseCoinDisplayProps extends UIMemeMetadata {
  variant?: "list" | "champion" | "battle" | "detail" | "swap";
  showRound?: boolean;
  showFavorite?: boolean;
  onToggleFavorite?: (address: string) => void;
  className?: string;
  // Market data
  marketCap?: number;
  price?: number;
  priceChange24h?: number;
  priceChangePercentage24h?: number;
  volume24h?: number;
  high24h?: number;
  low24h?: number;
  createdAt?: Date;
  isFavorite?: boolean;
  // Round specific data
  round?: number;
  share?: number;
  // Detail variant specific
  websiteLink?: string;
  telegramLink?: string;
  twitterLink?: string;
}
