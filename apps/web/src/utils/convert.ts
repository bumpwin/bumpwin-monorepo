import type { ChatMessage } from "@/types/chat";
import { generateAvatar } from "@/utils/avatar";
import type { ChatHistory } from "@workspace/supabase/src/domain";

// Convert ChatHistory to ChatMessage
export const convertToMessage = (chat: ChatHistory): ChatMessage => {
  // Ensure conversion from bigint to string
  const sequence =
    typeof chat.eventSequence === "bigint"
      ? chat.eventSequence.toString()
      : String(chat.eventSequence);

  return {
    id: `${chat.txDigest}-${sequence}`,
    username: chat.senderAddress,
    userId: chat.senderAddress,
    avatar: generateAvatar(chat.senderAddress),
    message: chat.messageText,
    timestamp: new Date(chat.createdAt),
  };
};
