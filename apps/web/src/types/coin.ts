import type { MemeMarketData, MemeMetadata } from "@workspace/types";

// Basic coin type that extends canonical types
export interface Coin extends Omit<MemeMetadata, "id">, Partial<MemeMarketData> {
  id: string; // Allow any string ID format for UI flexibility
  // Add any additional properties that components might need
}
