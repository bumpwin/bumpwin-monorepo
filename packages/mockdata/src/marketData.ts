import type { MEME_ID, MemeMarketData } from "@workspace/types";
import { MEME_IDS } from "./memeIds";
import { mockRoundData } from "./rounds";

// Generate market data for all memes
export const mockMemeMarketData: Record<MEME_ID, MemeMarketData> = Object.entries(MEME_IDS).reduce(
  (acc, [_symbol, id], _index) => {
    // Check if meme is in active round
    const activeRound = Object.values(mockRoundData).find((round) => round.status === "active");
    const _isInActiveRound = activeRound?.memeIds.includes(id) ?? false;

    const baseMarketCap = 1000000 + Math.floor(Math.random() * 9000000);

    acc[id] = {
      price: baseMarketCap / (1000000000 + Math.random() * 1000000000),
      marketCap: baseMarketCap,
    };

    return acc;
  },
  {} as Record<MEME_ID, MemeMarketData>,
);

export const getMemeMarketDataById = (memeId: MEME_ID): MemeMarketData | undefined =>
  mockMemeMarketData[memeId];

export const updateMemeMarketData = (memeId: MEME_ID, data: Partial<MemeMarketData>): void => {
  if (mockMemeMarketData[memeId]) {
    mockMemeMarketData[memeId] = { ...mockMemeMarketData[memeId], ...data };
  }
};
