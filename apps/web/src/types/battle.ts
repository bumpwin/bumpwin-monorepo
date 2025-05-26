import type { MemeMetadata } from "@workspace/types";

export interface BattleCoin {
  id: string;
  symbol: string;
  name: string;
  iconUrl: string;
  round: number;
  marketCap: number;
  price: number;
  description: string;
}

export const memeToBattleCoin = (meme: MemeMetadata): BattleCoin => ({
  id: meme.symbol,
  symbol: meme.symbol,
  name: meme.name,
  iconUrl: meme.iconUrl,
  round: 12,
  marketCap: 180000,
  price: 0.0018,
  description: meme.description,
});
