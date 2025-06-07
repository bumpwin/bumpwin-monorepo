import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getChampions,
  mockCoinMetadata,
  mockCoins,
  mockDominanceChartData,
} from "@workspace/mockdata";
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

// Query parameter validation using effect-ts
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

const parseChampionsQuery = (
  query: Record<string, string>,
): Effect.Effect<{ limit?: number; round?: number }, string> => {
  const limit = query.limit ? Number.parseInt(query.limit, 10) : undefined;
  const round = query.round ? Number.parseInt(query.round, 10) : undefined;

  // Validate parsed numbers
  if (query.limit && (Number.isNaN(limit) || limit < 0)) {
    return Effect.fail("Invalid limit parameter");
  }
  if (query.round && (Number.isNaN(round) || round < 0)) {
    return Effect.fail("Invalid round parameter");
  }

  return Effect.succeed({ limit, round });
};

// Data fetching functions using effect-ts
const fetchCoins = (limit?: number, offset?: number): Effect.Effect<typeof mockCoins, string> => {
  let coins = mockCoins;

  // Apply pagination if provided
  if (offset !== undefined) {
    coins = coins.slice(offset);
  }
  if (limit !== undefined) {
    coins = coins.slice(0, limit);
  }

  return Effect.succeed(coins);
};

const fetchCoinById = (id: string): Effect.Effect<(typeof mockCoins)[0], string> => {
  const coin = mockCoins.find((coin) => coin.id === id || coin.address === id);

  if (!coin) {
    return Effect.fail(`Coin with id ${id} not found`);
  }

  return Effect.succeed(coin);
};

const fetchCoinMetadata = (
  limit?: number,
  offset?: number,
): Effect.Effect<typeof mockCoinMetadata, string> => {
  let metadata = mockCoinMetadata;

  // Apply pagination if provided
  if (offset !== undefined) {
    metadata = metadata.slice(offset);
  }
  if (limit !== undefined) {
    metadata = metadata.slice(0, limit);
  }

  return Effect.succeed(metadata);
};

const fetchDominanceData = (
  limit?: number,
): Effect.Effect<typeof mockDominanceChartData, string> => {
  let dominanceData = mockDominanceChartData;

  // Apply limit if provided (get latest N points)
  if (limit !== undefined) {
    dominanceData = dominanceData.slice(-limit);
  }

  return Effect.succeed(dominanceData);
};

const fetchChampions = (
  limit?: number,
  round?: number,
): Effect.Effect<ReturnType<typeof getChampions>, string> => {
  let champions = getChampions();

  // Filter by round if provided
  if (round !== undefined) {
    champions = champions.filter((champion) => {
      // Access the round property safely
      const championRound =
        typeof champion === "object" && champion !== null && "round" in champion
          ? (champion as unknown as { round?: { round?: number } }).round?.round
          : undefined;
      return championRound === round;
    });
  }

  // Apply limit if provided
  if (limit !== undefined) {
    champions = champions.slice(0, limit);
  }

  return Effect.succeed(champions);
};

// Create OpenAPI Hono app with enhanced mockdata endpoints
export const openAPIBasicApi = new OpenAPIHono()
  // Get all coins with optional pagination
  .get("/coins", (c) => {
    const program = Effect.gen(function* () {
      const queryResult = yield* parsePaginationQuery(c.req.query());
      const coinsResult = yield* fetchCoins(queryResult.limit, queryResult.offset);
      return createResponse(coinsResult);
    });

    const result = Effect.runSync(
      Effect.catchAll(program, (error) => Effect.succeed(createErrorResponse(error))),
    );

    return c.json(result);
  })

  // Get specific coin by ID
  .get("/coins/:id", (c) => {
    const id = c.req.param("id");
    const program = Effect.gen(function* () {
      const coinResult = yield* fetchCoinById(id);
      return createResponse(coinResult);
    });

    const result = Effect.runSync(
      Effect.catchAll(program, (error) => Effect.succeed(createErrorResponse(error))),
    );

    const statusCode = result.success
      ? 200
      : "error" in result && result.error?.includes("not found")
        ? 404
        : 500;
    return c.json(result, statusCode);
  })

  // Get coin metadata with optional pagination
  .get("/coin-metadata", (c) => {
    const program = Effect.gen(function* () {
      const queryResult = yield* parsePaginationQuery(c.req.query());
      const metadataResult = yield* fetchCoinMetadata(queryResult.limit, queryResult.offset);
      return createResponse(metadataResult);
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
      const queryResult = yield* parseDominanceQuery(c.req.query());
      const dominanceResult = yield* fetchDominanceData(queryResult.limit);
      return createResponse(dominanceResult);
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

  // Get champions data with optional filtering
  .get("/champions", (c) => {
    const program = Effect.gen(function* () {
      const queryResult = yield* parseChampionsQuery(c.req.query());
      const championsResult = yield* fetchChampions(queryResult.limit, queryResult.round);
      return createResponse(championsResult);
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

  // Health check
  .get("/health", (c) => {
    return c.json(createResponse({ status: "OpenAPI basic mockdata API healthy" }));
  });

export type OpenAPIBasicApiType = typeof openAPIBasicApi;
