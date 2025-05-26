import {
  getCompletedRounds,
  getUpcomingRounds,
  mockRoundData,
} from "@workspace/mockdata";
import { Hono } from "hono";

export const roundsApi = new Hono();

// Get all rounds
roundsApi.get("/", (c) => {
  return c.json(Object.values(mockRoundData));
});

// Get completed rounds
roundsApi.get("/completed", (c) => {
  return c.json(getCompletedRounds());
});

// Get upcoming rounds
roundsApi.get("/upcoming", (c) => {
  return c.json(getUpcomingRounds());
});
