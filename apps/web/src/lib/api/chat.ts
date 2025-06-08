import { logger } from "@workspace/logger";
import type { ChatHistory } from "@workspace/supabase/src/domain";
import type { ApiError } from "@workspace/supabase/src/error";
import { createApiError } from "@workspace/supabase/src/error";
import { Effect } from "effect";

export interface SendChatMessageParams {
  txDigest: string;
  eventSequence: bigint;
  createdAt: string;
  senderAddress: string;
  messageText: string;
}

export const chatApi = {
  fetchLatest(limit = 10): Effect.Effect<ChatHistory[], ApiError> {
    return Effect.gen(function* () {
      const response = yield* Effect.tryPromise({
        try: () => fetch(`/api/chat?limit=${limit}`),
        catch: (error) => {
          logger.error("Failed to fetch chat messages", { error });
          return createApiError(
            "unknown",
            error instanceof Error ? error.message : "Failed to fetch chat messages",
          );
        },
      });

      const data = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: (error) => {
          logger.error("Failed to parse chat messages", { error });
          return createApiError(
            "unknown",
            error instanceof Error ? error.message : "Failed to parse chat messages",
          );
        },
      });

      if (!response.ok) {
        logger.error("Failed to fetch chat messages", {
          error: (data as { error: string }).error,
        });
        return yield* Effect.fail(createApiError("unknown", (data as { error: string }).error));
      }

      return data as ChatHistory[];
    });
  },
};
