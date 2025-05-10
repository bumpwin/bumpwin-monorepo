import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@workspace/supabase/src/client";
import { SupabaseRepository } from "@workspace/supabase/src/adapters";
import { ApiError } from "@workspace/supabase/src/error";
import { logger } from "@workspace/logger";

export const runtime = "edge";

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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    logger.info("Fetching chat messages", { limit });
    const result = await supabaseRepository.getLatestChatMessages({ limit });

    return result.match(
      (chatMessages) => {
        logger.info("Chat messages fetched successfully", {
          count: chatMessages.length,
        });
        return NextResponse.json(chatMessages);
      },
      (error: ApiError) => {
        logger.error("Chat messages get error", { error });
        return NextResponse.json(
          { error: error.message },
          { status: error.code },
        );
      },
    );
  } catch (error) {
    logger.error("Unexpected error in chat messages fetch", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
