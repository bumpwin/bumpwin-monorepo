import type { MemeMarketData, MemeMetadata } from "@workspace/types";

// Champion coin type
export interface ChampionCoin extends Omit<MemeMetadata, "id">, Partial<MemeMarketData> {
  id: string; // Allow any string ID format for UI flexibility
  round: number;
  marketCap: number;
}
