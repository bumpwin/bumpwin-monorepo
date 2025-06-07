import type { MemeMetadata } from "@workspace/types";

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
