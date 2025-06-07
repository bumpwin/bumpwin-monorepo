import {
  getChampions,
  mockCoinMetadata,
  mockCoins,
  mockDominanceChartData,
} from "@workspace/mockdata";
import { Hono } from "hono";
import type { ApiResponse } from "./types";

// Helper function to create standardized responses
const createResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  timestamp: Date.now(),
});

const createErrorResponse = (error: string) => ({
  success: false as const,
  error,
  timestamp: Date.now(),
});

export const mockdataApi = new Hono()
  // Get all coins
  .get("/coins", (c) => {
    try {
      const coins = mockCoins;
      return c.json(createResponse(coins));
    } catch (_error) {
      return c.json(createErrorResponse("Failed to fetch coins"), 500);
    }
  })

  // Get specific coin by ID
  .get("/coins/:id", (c) => {
    try {
      const id = c.req.param("id");
      const coin = mockCoins.find((coin) => coin.id === id || coin.address === id);

      if (!coin) {
        return c.json(createErrorResponse(`Coin with id ${id} not found`), 404);
      }

      return c.json(createResponse(coin));
    } catch (_error) {
      return c.json(createErrorResponse("Failed to fetch coin"), 500);
    }
  })

  // Get coin metadata (for charts and tables)
  .get("/coin-metadata", (c) => {
    try {
      const metadata = mockCoinMetadata;
      return c.json(createResponse(metadata));
    } catch (_error) {
      return c.json(createErrorResponse("Failed to fetch coin metadata"), 500);
    }
  })

  // Get dominance chart data
  .get("/dominance", (c) => {
    try {
      const dominanceData = mockDominanceChartData;
      return c.json(createResponse(dominanceData));
    } catch (_error) {
      return c.json(createErrorResponse("Failed to fetch dominance data"), 500);
    }
  })

  // Get champions data
  .get("/champions", (c) => {
    try {
      const champions = getChampions();
      return c.json(createResponse(champions));
    } catch (_error) {
      return c.json(createErrorResponse("Failed to fetch champions"), 500);
    }
  })

  // Health check for mockdata endpoints
  .get("/health", (c) => {
    return c.json(createResponse({ status: "mockdata API healthy" }));
  });

export type MockdataApiType = typeof mockdataApi;
