import type { MemeMarketData, MemeMetadata } from "@workspace/types";

// UI-compatible versions of canonical types that allow flexible ID formats
// while maintaining the core structure from packages/types

export interface UIMemeMetadata extends Omit<MemeMetadata, "id"> {
  id: string; // Allow flexible ID format for UI components
}

export type UIMemeMarketData = MemeMarketData;

// Common UI coin types that extend canonical types
export type UICoinData = UIMemeMetadata & UIMemeMarketData;
export type UIRoundCoinData = UICoinData & { round: number; share?: number };
