import process from "node:process";
import type { EventId } from "@mysten/sui/client";
import { logger } from "@workspace/logger";
import { NETWORK_TYPE } from "@workspace/sui";
import { SupabaseRepository } from "@workspace/supabase";
import type {
  GetPollCursorResponse,
  InsertChatMessageRequest,
  UpdatePollCursorRequest,
} from "@workspace/supabase";
import { EventFetcher } from "bumpwin";
import { listenChatEventPollingIntervalMs } from "./config";
import { supabase } from "./supabaseClient";
const dbRepository = new SupabaseRepository(supabase);
const POLLING_INTERVAL_MS = 5000;

// Singleton fetcher
const fetcher = new EventFetcher({
  network: NETWORK_TYPE,
  eventQueryLimit: 10,
});

/**
 * Get the initial cursor from Supabase
 */
async function getInitialCursor(): Promise<EventId | null> {
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
    logger.error("Error fetching initial poll cursor:", error);
    throw error;
  }
}

/**
 * Save chat message to Supabase
 */
async function saveChatMessage(event: any): Promise<void> {
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
        insertResult.error,
      );
    }
  } catch (error) {
    logger.error(`Error saving message (Digest: ${event.digest}):`, error);
  }
}

/**
 * Update poll cursor in Supabase
 */
async function updatePollCursor(cursor: EventId | null): Promise<void> {
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
      logger.error("Failed to update poll cursor:", updateResult.error);
    }
  } catch (error) {
    logger.error("Error updating poll cursor:", error);
  }
}

/**
 * Process new events, save to DB and log details
 */
async function processEvents(
  events: any[],
  processedEventIds: Set<string>,
): Promise<void> {
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
}

/**
 * Start polling for chat events
 */
export async function startChatEventPolling(pollingIntervalMs: number) {
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
        logger.error("Error in polling loop:", error);
      }
    }, POLLING_INTERVAL_MS);

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      clearInterval(intervalId);
      logger.info("Shutting down polling script...");
      process.exit(0);
    });

    // Keep the process running
    process.stdin.resume();
  } catch (error) {
    logger.error("Fatal error starting polling script:", error);
    process.exit(1);
  }
}

// Start the main process
async function main() {
  try {
    await startChatEventPolling(listenChatEventPollingIntervalMs);
  } catch (error) {
    logger.error("Failed to start polling script:", error);
    process.exit(1);
  }
}

// Run the main function
main();
