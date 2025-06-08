import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "@workspace/logger";
import { SupabaseRepository } from "@workspace/supabase";
import { createSupabaseClient } from "@workspace/supabase";
import type { ApiError } from "@workspace/supabase";
import { createApiError } from "@workspace/supabase";
import { Effect } from "effect";

let supabaseRepo: SupabaseRepository | null = null;

const getRepo = (): Effect.Effect<SupabaseRepository, ApiError> => {
  if (supabaseRepo) return Effect.succeed(supabaseRepo);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return Effect.fail(
      createApiError(
        "database",
        "Supabase environment variables are not configured",
        "Please check your environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
      ),
    );
  }

  const client = createSupabaseClient(url, anon);
  supabaseRepo = new SupabaseRepository(client);
  return Effect.succeed(supabaseRepo);
};

const parseLimit = (limitParam: string | undefined): Effect.Effect<number, ApiError> => {
  if (!limitParam) return Effect.succeed(40); // Default to 40 messages

  const limit = Number.parseInt(limitParam, 10);
  if (Number.isNaN(limit) || limit < 1) {
    return Effect.fail(
      createApiError("validation", "Invalid limit parameter", "Limit must be a positive number"),
    );
  }

  return Effect.succeed(limit);
};

/**
 * Get latest chat messages
 * @route GET /api/chat
 * @auth Not Required
 * @param {number} limit - Query parameter for the number of messages to retrieve
 *   - Format: /api/chat?limit=20
 *   - Default: 20
 * @returns {Array} Array of chat message objects
 *   - txDigest {string} Transaction digest
 *   - eventSequence {string} Event sequence
 *   - createdAt {string} Creation timestamp
 *   - senderAddress {string} Sender's address
 *   - messageText {string} Message content
 * @error
 *   - 500: Internal Server Error - Database or unexpected errors
 */
export const chatApi = new OpenAPIHono().get("/", async (c) => {
  const program = Effect.gen(function* () {
    const repo = yield* getRepo();
    const limit = yield* parseLimit(c.req.query("limit"));

    logger.info("Fetching chat messages", { limit });

    // Repository now returns Effect directly
    const chatMessages = yield* repo.getLatestChatMessages({ limit });

    logger.info("Chat messages fetched successfully", {
      count: chatMessages.length,
    });

    return chatMessages;
  });

  const result = await Effect.runPromise(
    Effect.catchAll(program, (error: ApiError) => {
      logger.error("API error", { error });
      return Effect.succeed({
        error: error.message,
        code: error.code,
        details: error.details,
        statusCode: error.code || 500,
      });
    }),
  );

  if ("error" in result) {
    return c.json(
      {
        error: result.error,
        code: result.code,
        details: result.details,
      },
      result.statusCode as unknown as 500,
    );
  }

  return c.json(result);
});
