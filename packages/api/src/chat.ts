import { logger } from "@workspace/logger";
import { SupabaseRepository } from "@workspace/supabase";
import { createSupabaseClient } from "@workspace/supabase";
import type { ApiError } from "@workspace/supabase";
import { createApiError } from "@workspace/supabase";
import { Hono } from "hono";
import { type Result, err, ok } from "neverthrow";

let supabaseRepo: SupabaseRepository | null = null;

const getRepo = (): Result<SupabaseRepository, ApiError> => {
  if (supabaseRepo) return ok(supabaseRepo);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return err(
      createApiError(
        "database",
        "Supabase environment variables are not configured",
        "Please check your environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
      ),
    );
  }

  const client = createSupabaseClient(url, anon);
  supabaseRepo = new SupabaseRepository(client);
  return ok(supabaseRepo);
};

const parseLimit = (limitParam: string | undefined): Result<number, ApiError> => {
  if (!limitParam) return ok(40); // Default to 40 messages

  const limit = Number.parseInt(limitParam, 10);
  if (Number.isNaN(limit) || limit < 1) {
    return err(
      createApiError("validation", "Invalid limit parameter", "Limit must be a positive number"),
    );
  }

  return ok(limit);
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
export const chatApi = new Hono().get("/", async (c) => {
  const repoResult = getRepo();
  if (repoResult.isErr()) {
    logger.error("Failed to get repository", { error: repoResult.error });
    return c.json(
      {
        error: repoResult.error.message,
        details: repoResult.error.details,
      },
      (repoResult.error.code || 500) as unknown as 500,
    );
  }

  const limitResult = parseLimit(c.req.query("limit"));
  if (limitResult.isErr()) {
    logger.error("Invalid limit parameter", { error: limitResult.error });
    return c.json(
      {
        error: limitResult.error.message,
        details: limitResult.error.details,
      },
      (limitResult.error.code || 400) as unknown as 400,
    );
  }

  const repo = repoResult.value;
  const limit = limitResult.value;

  logger.info("Fetching chat messages", { limit });
  const result = await repo.getLatestChatMessages({ limit });

  return result.match(
    (chatMessages) => {
      logger.info("Chat messages fetched successfully", {
        count: chatMessages.length,
      });
      return c.json(chatMessages);
    },
    (error: ApiError) => {
      logger.error("Chat messages get error", { error });
      return c.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        (error.code || 500) as unknown as 500,
      );
    },
  );
});
