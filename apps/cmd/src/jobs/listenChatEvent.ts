import process from "node:process";
import { config } from "@/config";
import { supabase } from "@/services/supabase";
import { logger } from "@/utils/logger";
import type { EventId } from "@mysten/sui/client";
import { NETWORK_TYPE } from "@workspace/sui";
import { SupabaseRepository } from "@workspace/supabase";
import type {
  GetPollCursorResponse,
  InsertChatMessageRequest,
  UpdatePollCursorRequest,
} from "@workspace/supabase";
import { EventFetcher } from "bumpwin";

const dbRepository = new SupabaseRepository(supabase);

// Singleton fetcher
const fetcher = new EventFetcher({
  network: NETWORK_TYPE,
  eventQueryLimit: 10,
});

/**
 * Get the initial cursor from Supabase
 */
const getInitialCursor = async (): Promise<EventId | null> => {
  try {
    const cursorResult = await dbRepository.getPollCursor();
    if (!cursorResult.isOk()) {
      if (cursorResult.error.type === "not_found") {
        logger.info(
          "No initial cursor found in Supabase, starting from scratch.",
        );
        return null;
      }
      throw cursorResult.error;
    }

    const pollCursor = cursorResult.value as GetPollCursorResponse;
    if (!pollCursor.cursor) {
      logger.info("Cursor exists but is null, starting from scratch.");
      return null;
    }

    const cursor = JSON.parse(pollCursor.cursor) as EventId;
    logger.info(`Initial cursor loaded from Supabase: ${pollCursor.cursor}`);
    return cursor;
  } catch (error) {
    logger.error("Error fetching initial poll cursor:", error as Error);
    throw error;
  }
};

/**
 * Save chat message to Supabase
 */
const saveChatMessage = async (event: any): Promise<void> => {
  try {
    const chatMessageRequest: InsertChatMessageRequest = {
      txDigest: event.digest,
      eventSequence: BigInt(event.sequence),
      createdAt: new Date(event.timestamp).toISOString(),
      senderAddress: event.sender,
      messageText: event.text,
    };

    const insertResult =
      await dbRepository.insertChatMessage(chatMessageRequest);
    if (insertResult.isOk()) {
      logger.info(
        `Message from ${event.sender} (Digest: ${event.digest}) saved to Supabase.`,
      );
    } else {
      logger.error(
        `Failed to save message (Digest: ${event.digest}):`,
        insertResult.error as unknown as Error,
      );
    }
  } catch (error) {
    logger.error(
      `Error saving message (Digest: ${event.digest}):`,
      error as Error,
    );
  }
};

/**
 * Update poll cursor in Supabase
 */
const updatePollCursor = async (cursor: EventId | null): Promise<void> => {
  try {
    const updateCursorRequest: UpdatePollCursorRequest = {
      cursor: cursor ? JSON.stringify(cursor) : null,
    };

    const updateResult =
      await dbRepository.updatePollCursor(updateCursorRequest);
    if (updateResult.isOk()) {
      logger.info(
        `Poll cursor updated in Supabase: ${updateCursorRequest.cursor}`,
      );
    } else {
      logger.error(
        "Failed to update poll cursor:",
        updateResult.error as unknown as Error,
      );
    }
  } catch (error) {
    logger.error("Error updating poll cursor:", error as Error);
  }
};

/**
 * Process new events, save to DB and log details
 */
const processEvents = async (
  events: any[],
  processedEventIds: Set<string>,
): Promise<void> => {
  if (events.length === 0) return;

  logger.info(
    `[${new Date().toISOString()}] Processing ${events.length} new event(s)`,
  );

  for (const event of events) {
    const eventId = `${event.digest}-${event.sequence}`;

    // Skip if already processed
    if (processedEventIds.has(eventId)) continue;

    // Log event details
    logger.info("----------------------------------------");
    logger.info(`Event: ${eventId}`);
    logger.info(`Timestamp: ${event.timestamp}`);
    logger.info(`Sender: ${event.sender}`);
    logger.info(`Text: "${event.text}"`);

    // Save to database
    await saveChatMessage(event);

    // Mark as processed
    processedEventIds.add(eventId);
  }
};

/**
 * Start polling for chat events
 */
export const startChatEventPolling = async (pollingIntervalMs: number) => {
  // Keep track of processed event IDs to avoid duplicates
  const processedEventIds = new Set<string>();

  try {
    // Get the initial cursor from the database
    let cursor = await getInitialCursor();

    logger.info("🚀 Starting polling for chat events...");
    logger.info(`Network: ${NETWORK_TYPE}, Interval: ${pollingIntervalMs}ms`);

    // Start the polling interval
    const intervalId = setInterval(async () => {
      try {
        // Fetch new events
        const result = await fetcher.fetch(cursor);

        // Filter only new events
        const newEvents = result.events.filter((event) => {
          const eventId = `${event.digest}-${event.sequence}`;
          return !processedEventIds.has(eventId);
        });

        // Process new events
        await processEvents(newEvents, processedEventIds);

        // Update cursor if changed
        if (JSON.stringify(cursor) !== JSON.stringify(result.cursor)) {
          cursor = result.cursor;
          await updatePollCursor(cursor);
        }
      } catch (error) {
        logger.error("Error in polling loop:", error as Error);
      }
    }, pollingIntervalMs);

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      clearInterval(intervalId);
      logger.info("Shutting down polling script...");
      process.exit(0);
    });

    // Keep the process running
    process.stdin.resume();
  } catch (error) {
    logger.error("Fatal error starting polling script:", error as Error);
    process.exit(1);
  }
};
