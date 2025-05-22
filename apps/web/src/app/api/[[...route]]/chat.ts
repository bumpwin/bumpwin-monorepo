import { logger } from "@workspace/logger";
import { SupabaseRepository } from "@workspace/supabase/src/adapters";
import { createSupabaseClient } from "@workspace/supabase/src/client";
import type { ApiError } from "@workspace/supabase/src/error";
import { Hono } from "hono";

// Edge Runtime configuration
export const runtime = "edge";

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const supabaseRepository = new SupabaseRepository(supabase);

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
  try {
    const limitParam = c.req.query("limit");
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 10;

    if (Number.isNaN(limit) || limit < 1) {
      return new Response(
        JSON.stringify({ error: "Invalid limit parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    logger.info("Fetching chat messages", { limit });
    const result = await supabaseRepository.getLatestChatMessages({ limit });

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
          },
        );
      },
    );
  } catch (error) {
    logger.error("Unexpected error in chat messages fetch", { error });
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      },
    );
  }
});
