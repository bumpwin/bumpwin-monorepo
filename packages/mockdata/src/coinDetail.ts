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

// Mock coin detail data - based on MemeMetadata
export const mockCoinDetail: CoinDetailData = {
  id: "0x1234567890abcdef1234567890abcdef12345678" as `0x${string}`,
  address: "0x1234567890abcdef1234567890abcdef12345678",
  symbol: "BONK",
  name: "BONK MUSK",
  iconUrl: "/icon.png",
  logoUrl: "/icon.png", // Alias for compatibility
  description: "A community-driven meme token inspired by Elon Musk's love for Dogecoin.",
  marketCap: 44540,
  price: 0.000123,
  priceChange24h: 5.67,
  priceChangePercentage24h: 5.67,
  volume24h: 12345.67,
  high24h: 0.00015,
  low24h: 0.0001,
  createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
  isFavorite: true,
};
