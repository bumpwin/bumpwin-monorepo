import { OpenAPIHono } from "@hono/zod-openapi";
import { getCurrentRound, mockCoins, mockDominanceChartData, mockmemes } from "@workspace/mockdata";
import { Effect } from "effect";
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

// Query parameter validation using class-free effect pattern
const parsePaginationQuery = (
  query: Record<string, string>,
): Effect.Effect<{ limit?: number; offset?: number }, string> => {
  const limit = query.limit ? Number.parseInt(query.limit, 10) : undefined;
  const offset = query.offset ? Number.parseInt(query.offset, 10) : undefined;

  // Validate parsed numbers
  if (query.limit && (Number.isNaN(limit) || limit < 0)) {
    return Effect.fail("Invalid limit parameter");
  }
  if (query.offset && (Number.isNaN(offset) || offset < 0)) {
    return Effect.fail("Invalid offset parameter");
  }

  return Effect.succeed({ limit, offset });
};

const parseDominanceQuery = (
  query: Record<string, string>,
): Effect.Effect<{ timeframe?: "1h" | "24h" | "7d" | "30d"; limit?: number }, string> => {
  const timeframe = query.timeframe as "1h" | "24h" | "7d" | "30d" | undefined;
  const limit = query.limit ? Number.parseInt(query.limit, 10) : undefined;

  // Validate timeframe
  if (timeframe && !["1h", "24h", "7d", "30d"].includes(timeframe)) {
    return Effect.fail("Invalid timeframe. Must be one of: 1h, 24h, 7d, 30d");
  }

  // Validate limit
  if (query.limit && (Number.isNaN(limit) || limit < 0)) {
    return Effect.fail("Invalid limit parameter");
  }

  return Effect.succeed({ timeframe, limit });
};

export const mockdataApi = new OpenAPIHono()
  // Get all coins with optional pagination
  .get("/coins", (c) => {
    const program = Effect.gen(function* () {
      const queryParams = yield* parsePaginationQuery(c.req.query());
      let coins = mockCoins;

      // Apply pagination if provided
      if (queryParams.offset !== undefined) {
        coins = coins.slice(queryParams.offset);
      }
      if (queryParams.limit !== undefined) {
        coins = coins.slice(0, queryParams.limit);
      }

      return createResponse(coins);
    });

    const result = Effect.runSync(
      Effect.catchAll(program, (error) => Effect.succeed(createErrorResponse(error))),
    );

    const statusCode = result.success
      ? 200
      : "error" in result && result.error?.includes("Invalid")
        ? 400
        : 500;
    return c.json(result, statusCode);
  })

  // Get specific coin by ID
  .get("/coins/:id", (c) => {
    const id = c.req.param("id");
    const coin = mockCoins.find((coin) => coin.id === id || coin.address === id);

    if (!coin) {
      return c.json(createErrorResponse(`Coin with id ${id} not found`), 404);
    }

    return c.json(createResponse(coin));
  })

  // Get coin metadata (for charts and tables) with optional pagination
  .get("/coin-metadata", (c) => {
    const program = Effect.gen(function* () {
      const queryParams = yield* parsePaginationQuery(c.req.query());

      // Check for darknight mode query parameter
      const isDarknightMode = c.req.query("darknight") === "true";

      let sourceData = mockmemes;

      // If darknight mode, filter to current round coins only
      if (isDarknightMode) {
        const currentRound = getCurrentRound();

        if (currentRound && currentRound.memeIds.length > 0) {
          // Filter mockmemes to only include current round memes
          sourceData = mockmemes.filter((meme) => currentRound.memeIds.includes(meme.id));
        }
      }

      // Generate metadata with requested limit (default to all available)
      const requestedLimit = queryParams.limit || sourceData.length;
      const startOffset = queryParams.offset || 0;

      const metadata = sourceData
        .slice(startOffset, startOffset + requestedLimit)
        .map((meme, index) => ({
          id: startOffset + index,
          symbol: meme.symbol,
          name: meme.name,
          icon: meme.iconUrl,
          description: meme.description,
          telegramLink: "",
          websiteLink: "",
          twitterLink: "",
        }));

      return createResponse(metadata);
    });

    const result = Effect.runSync(
      Effect.catchAll(program, (error) => Effect.succeed(createErrorResponse(error))),
    );

    const statusCode = result.success
      ? 200
      : "error" in result && result.error?.includes("Invalid")
        ? 400
        : 500;
    return c.json(result, statusCode);
  })

  // Get dominance chart data with optional filtering
  .get("/dominance", (c) => {
    const program = Effect.gen(function* () {
      const queryParams = yield* parseDominanceQuery(c.req.query());
      let dominanceData = mockDominanceChartData;

      // Apply limit if provided (get latest N points)
      if (queryParams.limit !== undefined) {
        dominanceData = dominanceData.slice(-queryParams.limit);
      }

      // Note: timeframe filtering could be implemented based on requirements
      // For now, we return the mock data as-is

      return createResponse(dominanceData);
    });

    const result = Effect.runSync(
      Effect.catchAll(program, (error) => Effect.succeed(createErrorResponse(error))),
    );

    const statusCode = result.success
      ? 200
      : "error" in result && result.error?.includes("Invalid")
        ? 400
        : 500;
    return c.json(result, statusCode);
  })

  // Get mockmemes gallery data
  .get("/mockmemes", (c) => {
    return c.json(createResponse(mockmemes));
  })

  // Health check for mockdata endpoints
  .get("/health", (c) => {
    return c.json(createResponse({ status: "mockdata API healthy" }));
  });

export type MockdataApiType = typeof mockdataApi;
