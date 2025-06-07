import type { MemeMarketData, MemeMetadata } from "@workspace/types";

// Coin card type for UI components
export interface CoinCard extends Omit<MemeMetadata, "id">, Partial<MemeMarketData> {
  id: string; // Allow any string ID format for UI flexibility
  // Add any additional properties for card display
}

// Local props interface for CoinCard component
export interface LocalCoinCardProps {
  coin: CoinCard;
  // Add other props as needed
}

// Re-export the CoinCardProps from mockdata for compatibility
export type { CoinCardProps } from "@workspace/mockdata";
