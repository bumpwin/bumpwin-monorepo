import type { MemeMarketData, MemeMetadata } from "@workspace/types";

// Replacement type for the deprecated RoundCoin
// Uses canonical types with minimal extensions for round-based functionality
export interface CoinWithRound extends Omit<MemeMetadata, "id">, Partial<MemeMarketData> {
  id: string; // Allow flexible ID format for UI components
  round: number;
  share?: number;
  price?: number; // Optional for backward compatibility
  marketCap: number; // Required for UI display
}
