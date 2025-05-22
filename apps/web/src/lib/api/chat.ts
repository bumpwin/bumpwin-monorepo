import { logger } from "@workspace/logger";
import type { ChatHistory } from "@workspace/supabase/src/domain";
import type { ApiError } from "@workspace/supabase/src/error";
import { createApiError } from "@workspace/supabase/src/error";
import { Result, err, ok } from "neverthrow";

export interface SendChatMessageParams {
  txDigest: string;
  eventSequence: bigint;
  createdAt: string;
  senderAddress: string;
  messageText: string;
}

export const chatApi = {
  async fetchLatest(limit = 10): Promise<Result<ChatHistory[], ApiError>> {
    const response = await fetch(`/api/chat?limit=${limit}`);
    const data = await response.json();

    if (!response.ok) {
      logger.error("Failed to fetch chat messages", {
        error: (data as { error: string }).error,
      });
      return err(createApiError("unknown", (data as { error: string }).error));
    }

    return ok(data as ChatHistory[]);
  },
};
