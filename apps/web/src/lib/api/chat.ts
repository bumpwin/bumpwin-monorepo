import { logger } from "@workspace/logger";
import type { ChatHistory } from "@workspace/supabase/src/domain";

export interface SendChatMessageParams {
  txDigest: string;
  eventSequence: bigint;
  createdAt: string;
  senderAddress: string;
  messageText: string;
}

export const chatApi = {
  async fetchLatest(limit: number = 10): Promise<ChatHistory[]> {
    try {
      const response = await fetch(`/api/chat?limit=${limit}`);
      const data = await response.json();
      if (!response.ok) {
        logger.error("Failed to fetch chat messages", {
          error: (data as { error: string }).error,
        });
        throw new Error((data as { error: string }).error);
      }
      return data as ChatHistory[];
    } catch (error) {
      logger.error("Error fetching chat messages", { error });
      throw error;
    }
  },
};
