import {
  type RealtimeChannel,
  type RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import type { ChatHistory } from "./domain";
import { logger } from "@workspace/logger";
import { supabase } from "./client";

/**
 * Database schema for chat_history table
 */
interface ChatHistoryRecord {
  tx_digest: string;
  event_sequence: string | number;
  created_at: string;
  sender_address: string;
  message_text: string;
  [key: string]: any; // For any additional fields
}

/**
 * Type for the new chat message payload from real-time updates
 */
export type ChatMessagePayload = RealtimePostgresChangesPayload<
  ChatHistoryRecord
>;

/**
 * Callback function type for chat message events
 */
export type ChatMessageCallback = (message: ChatHistory) => void;

/**
 * Map PostgreSQL column names to our domain model
 */
function mapToChatHistory(payload: ChatMessagePayload): ChatHistory {
  // Use type assertion to ensure we can access the properties
  const data = payload.new as ChatHistoryRecord;
  return {
    txDigest: data.tx_digest,
    eventSequence: BigInt(data.event_sequence),
    createdAt: data.created_at,
    senderAddress: data.sender_address,
    messageText: data.message_text,
  };
}

// Store active subscriptions for management
const activeSubscriptions: Map<string, RealtimeChannel> = new Map();

/**
 * Subscribe to chat history table changes
 * @param callback Function to call when new messages arrive
 * @param channelName Optional custom channel name
 * @returns Subscription ID that can be used to unsubscribe
 */
export function subscribeToChatMessages(
  callback: ChatMessageCallback,
  channelName: string = "chat-updates",
): string {
  try {
    // Create a unique subscription ID
    const subscriptionId = `${channelName}-${Date.now()}`;

    // Create and configure the channel
    const channel = supabase
      .channel(subscriptionId)
      .on(
        "postgres_changes",
        {
          event: "INSERT", // Only listen for new messages
          schema: "public",
          table: "chat_history",
        },
        (payload: ChatMessagePayload) => {
          try {
            // Use type assertion here too
            const data = payload.new as ChatHistoryRecord;
            logger.info("Received new chat message via real-time", {
              txDigest: data.tx_digest,
              event: payload.eventType,
            });

            // Map the payload to our domain model
            const chatMessage = mapToChatHistory(payload);

            // Execute the callback
            callback(chatMessage);
          } catch (error) {
            logger.error("Error processing real-time chat message", { error });
          }
        },
      )
      .subscribe((status) => {
        logger.info("Chat subscription status", {
          status,
          channel: subscriptionId,
        });
      });

    // Store the subscription
    activeSubscriptions.set(subscriptionId, channel);

    return subscriptionId;
  } catch (error) {
    logger.error("Error subscribing to chat messages", { error });
    throw error;
  }
}

/**
 * Unsubscribe from a specific chat subscription
 * @param subscriptionId ID returned from subscribeToChatMessages
 * @returns true if successfully unsubscribed, false otherwise
 */
export function unsubscribeFromChatMessages(subscriptionId: string): boolean {
  try {
    const channel = activeSubscriptions.get(subscriptionId);

    if (!channel) {
      logger.warn("Tried to unsubscribe from non-existent channel", {
        subscriptionId,
      });
      return false;
    }

    // Unsubscribe and remove from active subscriptions
    channel.unsubscribe();
    activeSubscriptions.delete(subscriptionId);

    logger.info("Unsubscribed from chat messages", { subscriptionId });
    return true;
  } catch (error) {
    logger.error("Error unsubscribing from chat messages", {
      error,
      subscriptionId,
    });
    return false;
  }
}

/**
 * Unsubscribe from all active chat subscriptions
 * @returns Number of subscriptions that were closed
 */
export function unsubscribeAllChatMessages(): number {
  try {
    let count = 0;

    // Unsubscribe from all channels
    for (const [id, channel] of activeSubscriptions.entries()) {
      channel.unsubscribe();
      activeSubscriptions.delete(id);
      count++;
    }

    logger.info("Unsubscribed from all chat messages", { count });
    return count;
  } catch (error) {
    logger.error("Error unsubscribing from all chat messages", { error });
    return 0;
  }
}
