import type { MemeMetadata } from "@workspace/types";
import { getMemeMarketDataById } from "./marketData";
import { mockmemes } from "./mockMemes";

// CoinCardProps interface - extends MemeMetadata
export interface CoinCardProps extends MemeMetadata {
  address: string;
  logoUrl: string; // Alias for iconUrl for compatibility
  createdAt: Date;
  isFavorite: boolean;
  marketCap: number;
  onToggleFavorite?: (id: string) => void;
  round?: number;
  performanceTag?: string;
  winRate?: number;
  priceHistory?: Array<{ t: number; v: number }>;
  role?: string;
  isHighlighted?: boolean;
}

export const getCoinCards = (limit = 6): CoinCardProps[] => {
  return mockmemes.slice(0, limit).map((meme: MemeMetadata, index: number) => {
    const marketData = getMemeMarketDataById(meme.id);
    return {
      ...meme, // MemeMetadata properties (id, symbol, name, description, iconUrl)
      logoUrl: meme.iconUrl, // Alias for compatibility
      address: `0x${index.toString().padStart(40, "0")}`,
      createdAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000),
      isFavorite: index === 0,
      marketCap: marketData?.marketCap || 50000,
      onToggleFavorite: undefined,
    };
  });
};

// Legacy compatibility - exact match with tempMockData
export const mockCoins = getCoinCards();
