import { type AppError, AppErrors } from "@/lib/errors";
import { logger } from "@workspace/logger";
import type { ChatHistory } from "@workspace/supabase/src/domain";
import { Effect } from "effect";

export interface SendChatMessageParams {
  txDigest: string;
  eventSequence: bigint;
  createdAt: string;
  senderAddress: string;
  messageText: string;
}

export const chatApi = {
  fetchLatest(limit = 10): Effect.Effect<ChatHistory[], AppError> {
    return Effect.gen(function* () {
      const response = yield* Effect.tryPromise({
        try: () => fetch(`/api/chat?limit=${limit}`),
        catch: (error) => {
          logger.error("Failed to fetch chat messages", { error });
          return AppErrors.network(
            error instanceof Error ? error.message : "Failed to fetch chat messages",
            error,
          );
        },
      });

      const data = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: (error) => {
          logger.error("Failed to parse chat messages", { error });
          return AppErrors.network(
            error instanceof Error ? error.message : "Failed to parse chat messages",
            error,
          );
        },
      });

      if (!response.ok) {
        const errorMessage = (data as { error?: string }).error || `HTTP ${response.status}`;
        logger.error("Failed to fetch chat messages", { error: errorMessage });

        if (response.status === 404) {
          return yield* Effect.fail(AppErrors.notFound("chat messages"));
        }
        if (response.status === 429) {
          return yield* Effect.fail(AppErrors.rateLimit(10));
        }
        if (response.status >= 500) {
          return yield* Effect.fail(AppErrors.database(errorMessage));
        }

        return yield* Effect.fail(AppErrors.network(errorMessage));
      }

      return data as ChatHistory[];
    });
  },
};
