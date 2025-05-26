import {
  getCurrentRound,
  mockMemeMarketData,
  mockMemeMetadata,
  mockRoundData,
} from "@workspace/mockdata";
import { Hono } from "hono";

export const battlesApi = new Hono();

// Get current battle round with meme data
battlesApi.get("/current", (c) => {
  const currentRound = getCurrentRound();
  if (!currentRound) {
    return c.json({ error: "No active battle round" }, 404);
  }

  // Include meme metadata and market data for current round
  const memes = currentRound.memeIds
    .map((id) => ({
      metadata: mockMemeMetadata[id],
      marketData: mockMemeMarketData[id],
    }))
    .filter((m) => m.metadata);

  return c.json({
    round: currentRound,
    memes,
  });
});

// Get all rounds
battlesApi.get("/rounds", (c) => {
  return c.json(Object.values(mockRoundData));
});

// Get specific round
battlesApi.get("/rounds/:id", (c) => {
  const roundId = c.req.param("id");
  const round = mockRoundData[roundId];

  if (!round) {
    return c.json({ error: "Round not found" }, 404);
  }

  return c.json(round);
});
