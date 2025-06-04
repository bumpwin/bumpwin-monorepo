import { logger } from "@workspace/logger";
import type { ChatHistory } from "@workspace/supabase/src/domain";
import type { ApiError } from "@workspace/supabase/src/error";
import { createApiError } from "@workspace/supabase/src/error";
import { ResultAsync, err, ok } from "neverthrow";

export interface SendChatMessageParams {
  txDigest: string;
  eventSequence: bigint;
  createdAt: string;
  senderAddress: string;
  messageText: string;
}

export const chatApi = {
  fetchLatest(limit = 10): ResultAsync<ChatHistory[], ApiError> {
    return ResultAsync.fromPromise(fetch(`/api/chat?limit=${limit}`), (error) => {
      logger.error("Failed to fetch chat messages", { error });
      return createApiError(
        "unknown",
        error instanceof Error ? error.message : "Failed to fetch chat messages",
      );
    })
      .andThen((response) =>
        ResultAsync.fromPromise(response.json(), (error) => {
          logger.error("Failed to parse chat messages", { error });
          return createApiError(
            "unknown",
            error instanceof Error ? error.message : "Failed to parse chat messages",
          );
        }).map((data) => ({ response, data })),
      )
      .andThen(({ response, data }) => {
        if (!response.ok) {
          logger.error("Failed to fetch chat messages", {
            error: (data as { error: string }).error,
          });
          return err(createApiError("unknown", (data as { error: string }).error));
        }
        return ok(data as ChatHistory[]);
      });
  },
};
