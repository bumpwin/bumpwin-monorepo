import { getChampions, mockMemeMarketData } from "@workspace/mockdata";
import { Hono } from "hono";

export const championsApi = new Hono();

// Get all champions with market data
championsApi.get("/", (c) => {
  const champions = getChampions();
  console.log("Champions from getChampions():", champions);

  // Enrich with market data
  const enrichedChampions = champions.map(({ round, meme }) => ({
    round,
    meme: meme
      ? {
          ...meme,
          ...mockMemeMarketData[meme.id],
        }
      : null,
  }));

  console.log("Enriched champions:", enrichedChampions);
  return c.json(enrichedChampions);
});
