import { OpenAPIHono } from "@hono/zod-openapi";
import { getChampions, mockMemeMarketData } from "@workspace/mockdata";

export const championsApi = new OpenAPIHono()
  // Get all champions with market data
  .get("/", (c) => {
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
