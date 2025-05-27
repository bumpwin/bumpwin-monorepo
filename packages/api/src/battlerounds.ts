import {
  getCompletedRounds,
  getCurrentRound,
  getUpcomingRounds,
  mockMemeMarketData,
  mockMemeMetadata,
  mockRoundData,
} from "@workspace/mockdata";
import type { MEME_ID } from "@workspace/types";
import { Hono } from "hono";

export const battleroundsApi = new Hono()
  // Get all rounds
  .get("/", (c) => {
    return c.json(Object.values(mockRoundData));
  })
  // Get current battle round with meme data
  .get("/current", (c) => {
    const currentRound = getCurrentRound();
    if (!currentRound) {
      return c.json({ error: "No active battle round" }, 404);
    }

    // Include meme metadata and market data for current round
    const memes = currentRound.memeIds
      .map((id) => ({
        metadata: mockMemeMetadata[id as MEME_ID],
        marketData: mockMemeMarketData[id as MEME_ID],
      }))
      .filter((m) => m.metadata);

    return c.json({
      round: currentRound,
      memes,
    });
  })
  // Get completed rounds
  .get("/completed", (c) => {
    return c.json(getCompletedRounds());
  })
  // Get upcoming rounds
  .get("/upcoming", (c) => {
    return c.json(getUpcomingRounds());
  })
  // Get specific round
  .get("/:id", (c) => {
    const roundId = c.req.param("id");
    const round = mockRoundData[roundId];

    if (!round) {
      return c.json({ error: "Round not found" }, 404);
    }

    return c.json(round);
  });
