import { logger } from "@workspace/logger";
import { SupabaseRepository } from "@workspace/supabase/src/adapters";
import { createSupabaseClient } from "@workspace/supabase/src/client";
import type { ApiError } from "@workspace/supabase/src/error";
import { createApiError } from "@workspace/supabase/src/error";
import { Hono } from "hono";
import { type Result, err, ok } from "neverthrow";

// Edge Runtime configuration
export const runtime = "edge";
export const dynamic = "force-dynamic";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Required environment variables are not defined");
// }

// const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// const supabaseRepository = new SupabaseRepository(supabase);

let supabaseRepo: SupabaseRepository | null = null;

const getRepo = (): Result<SupabaseRepository, ApiError> => {
  if (supabaseRepo) return ok(supabaseRepo);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return err(createApiError(
      "database",
      "Supabase environment variables are not configured",
      "Please check your environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    ));
  }

  const client = createSupabaseClient(url, anon);
  supabaseRepo = new SupabaseRepository(client);
  return ok(supabaseRepo);
};

const parseLimit = (limitParam: string | undefined): Result<number, ApiError> => {
  if (!limitParam) return ok(10);

  const limit = Number.parseInt(limitParam, 10);
  if (Number.isNaN(limit) || limit < 1) {
    return err(createApiError(
      "validation",
      "Invalid limit parameter",
      "Limit must be a positive number"
    ));
  }

  return ok(limit);
};

/**
 * Get latest chat messages
 * @route GET /api/chat
 * @auth Not Required
 * @param {number} limit - Query parameter for the number of messages to retrieve
 *   - Format: /api/chat?limit=20
 *   - Default: 10
 * @returns {Array} Array of chat message objects
 *   - txDigest {string} Transaction digest
 *   - eventSequence {string} Event sequence
 *   - createdAt {string} Creation timestamp
 *   - senderAddress {string} Sender's address
 *   - messageText {string} Message content
 * @error
 *   - 500: Internal Server Error - Database or unexpected errors
 */
export const app = new Hono().get("/", async (c) => {
  const repoResult = getRepo();
  if (repoResult.isErr()) {
    logger.error("Failed to get repository", { error: repoResult.error });
    return new Response(
      JSON.stringify({
        error: repoResult.error.message,
        details: repoResult.error.details
      }),
      {
        status: repoResult.error.code || 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }

  const limitResult = parseLimit(c.req.query("limit"));
  if (limitResult.isErr()) {
    logger.error("Invalid limit parameter", { error: limitResult.error });
    return new Response(
      JSON.stringify({
        error: limitResult.error.message,
        details: limitResult.error.details
      }),
      {
        status: limitResult.error.code || 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
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
      return c.json(chatMessages, 200, {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      });
    },
    (error: ApiError) => {
      logger.error("Chat messages get error", { error });
      return new Response(
        JSON.stringify({
          error: error.message,
          code: error.code,
          details: error.details,
        }),
        {
          status: error.code || 500,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );
    }
  );
});
