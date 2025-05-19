import { Hono } from "hono";
import { logger } from "@workspace/logger";
import { SupabaseRepository } from "@workspace/supabase/src/adapters";
import { supabase } from "@workspace/supabase/src/client";
import type { ApiError } from "@workspace/supabase/src/error";

// Edge Runtime configuration
export const runtime = 'edge';

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

    logger.info("Fetching chat messages", { limit });
    const result = await supabaseRepository.getLatestChatMessages({ limit });

    return result.match(
      (chatMessages) => {
        logger.info("Chat messages fetched successfully", {
          count: chatMessages.length,
        });
        return c.json(chatMessages);
      },
      (error: ApiError) => {
        logger.error("Chat messages get error", { error });
        return new Response(JSON.stringify({ error: error.message }), { 
          status: error.code,
          headers: { 'Content-Type': 'application/json' }
        });
      },
    );
  } catch (error) {
    logger.error("Unexpected error in chat messages fetch", { error });
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});