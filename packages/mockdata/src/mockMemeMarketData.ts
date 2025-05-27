import { mockmemes } from "./mockMemes";
import type { MEME_ID, MemeMarketData } from "./types";

const mockMemeMarketData: Record<MEME_ID, MemeMarketData> = {};

// Generate mock market data for each meme token
for (const meme of mockmemes) {
  // Generate random but realistic market data
  const marketCap = Math.floor(Math.random() * 10000000000) + 1000000; // Between 1M and 10B
  const price = marketCap / (Math.random() * 1000000000 + 1000000); // Price based on market cap and random supply
  const share = Math.random() * 0.4 + 0.1; // Between 10% and 50%

  mockMemeMarketData[meme.id] = {
    marketCap,
    price,
    share,
  };
}

export { mockMemeMarketData };
