import process from "node:process";
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

// Event type definition
interface ChatEvent {
  digest: string;
  sequence: number;
  timestamp: string | number;
  sender: string;
  text: string;
}
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
        logger.info("No initial cursor found in Supabase, starting from scratch.");
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
const saveChatMessage = async (event: ChatEvent): Promise<void> => {
  try {
    const chatMessageRequest: InsertChatMessageRequest = {
      txDigest: event.digest,
      eventSequence: BigInt(event.sequence),
      createdAt: new Date(
        typeof event.timestamp === "string" ? Number.parseInt(event.timestamp) : event.timestamp,
      ).toISOString(),
      senderAddress: event.sender,
      messageText: event.text,
    };

    const insertResult = await dbRepository.insertChatMessage(chatMessageRequest);
    if (insertResult.isOk()) {
      logger.info(`Message from ${event.sender} (Digest: ${event.digest}) saved to Supabase.`);
    } else {
      logger.error(
        `Failed to save message (Digest: ${event.digest}):`,
        insertResult.error as unknown as Error,
      );
    }
  } catch (error) {
    logger.error(`Error saving message (Digest: ${event.digest}):`, error as Error);
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

    const updateResult = await dbRepository.updatePollCursor(updateCursorRequest);
    if (updateResult.isOk()) {
      logger.info(`Poll cursor updated in Supabase: ${updateCursorRequest.cursor}`);
    } else {
      logger.error("Failed to update poll cursor:", updateResult.error as unknown as Error);
    }
  } catch (error) {
    logger.error("Error updating poll cursor:", error as Error);
  }
};

/**
 * Check if an event has already been processed and saved to the database
 */
const isEventAlreadyProcessed = async (eventId: string): Promise<boolean> => {
  try {
    // Split the eventId into digest and sequence
    const [digest, sequenceStr] = eventId.split("-");
    if (!digest || sequenceStr === undefined) {
      logger.error(`Invalid event ID format: ${eventId}`);
      return false;
    }

    const sequence = BigInt(sequenceStr);

    // Check if the message exists in the database using a direct query
    const { data, error } = await supabase
      .from("chat_history")
      .select("id")
      .eq("tx_digest", digest)
      .eq("event_sequence", sequence.toString())
      .limit(1);

    if (error) {
      // Convert PostgrestError to Error
      const dbError = new Error(error.message);
      dbError.name = "PostgrestError";
      logger.error("Error checking if event exists:", dbError);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    logger.error(`Error checking if event ${eventId} exists:`, error as Error);
    return false; // Assume not processed in case of error
  }
};

/**
 * Process new events, save to DB and log details
 */
const processEvents = async (
  events: ChatEvent[],
  processedEventIds: Set<string>,
): Promise<void> => {
  if (events.length === 0) return;

  logger.info(`[${new Date().toISOString()}] Processing ${events.length} new event(s)`);

  // First, check all events against the database in a single pass
  const eventsToProcess = [];
  for (const event of events) {
    const eventId = `${event.digest}-${event.sequence}`;

    // Skip if already processed in this session
    if (processedEventIds.has(eventId)) {
      logger.info(`Skipping already processed event in this session: ${eventId}`);
      continue;
    }

    // Add to list of events to check against DB
    eventsToProcess.push({ event, eventId });
  }

  if (eventsToProcess.length === 0) {
    logger.info("No events to process after memory cache check");
    return;
  }

  // Check all events against the database
  logger.info(`Checking ${eventsToProcess.length} events against database`);

  for (const { event, eventId } of eventsToProcess) {
    try {
      // Check if already in database
      const alreadyProcessed = await isEventAlreadyProcessed(eventId);
      if (alreadyProcessed) {
        logger.info(`Event ${eventId} already exists in database - skipping`);
        // Mark as processed in memory to avoid future checks
        processedEventIds.add(eventId);
        continue;
      }

      // Log event details
      logger.info("----------------------------------------");
      logger.info(`Event: ${eventId}`);
      logger.info(`Timestamp: ${event.timestamp}`);
      logger.info(`Sender: ${event.sender}`);
      logger.info(`Text: "${event.text}"`);

      // Save to database
      await saveChatMessage(event);

      // Mark as processed in memory
      processedEventIds.add(eventId);

      // Small delay between processing each event to avoid overwhelming the database
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      logger.error(`Error processing event ${eventId}:`, error as Error);
      // Don't add to processedEventIds so we can retry next time
    }
  }
};

/**
 * Start polling for chat events
 */
export const startChatEventPolling = async (pollingIntervalMs: number) => {
  // Keep track of processed event IDs to avoid duplicates
  const processedEventIds = new Set<string>();

  // Flag to prevent concurrent polling executions
  let isPolling = false;
  // Flag to determine if we've completed first poll
  let isFirstPoll = true;

  try {
    // Get the initial cursor from the database
    let cursor = await getInitialCursor();

    logger.info("🚀 Starting polling for chat events...");
    logger.info(`Network: ${NETWORK_TYPE}, Interval: ${pollingIntervalMs}ms`);

    // Define the polling function separately for better control
    const pollEvents = async () => {
      // Skip if already polling
      if (isPolling) {
        logger.info("Skipping poll cycle - previous cycle still in progress");
        return;
      }

      isPolling = true;

      try {
        logger.info(`Starting poll cycle with cursor: ${JSON.stringify(cursor)}`);

        // Fetch new events
        const result = await fetcher.fetch(cursor);

        // Check if any events were returned
        logger.info(`Fetched ${result.events.length} events`);

        if (result.events.length > 0) {
          // On first poll, just save the cursor without processing events
          // This helps when restarting the server to avoid reprocessing old events
          if (isFirstPoll) {
            logger.info("First poll - updating cursor without processing events");
            cursor = result.cursor;
            await updatePollCursor(cursor);
            isFirstPoll = false;
            return;
          }

          // Filter only new events that haven't been processed in this session
          const newEvents = result.events.filter((event) => {
            const eventId = `${event.digest}-${event.sequence}`;
            return !processedEventIds.has(eventId);
          });

          // Process the filtered events
          if (newEvents.length > 0) {
            logger.info(
              `Processing ${newEvents.length} new events of ${result.events.length} total`,
            );
            await processEvents(newEvents, processedEventIds);
          } else {
            logger.info("No new events to process after filtering");
          }
        }

        // Always update cursor if changed, even if no events to process
        if (JSON.stringify(cursor) !== JSON.stringify(result.cursor)) {
          logger.info(
            `Updating cursor from ${JSON.stringify(cursor)} to ${JSON.stringify(result.cursor)}`,
          );
          cursor = result.cursor;
          await updatePollCursor(cursor);
        }
      } catch (error) {
        logger.error("Error in polling function:", error as Error);
      } finally {
        isPolling = false;
      }
    };

    // Run the initial poll immediately
    await pollEvents();

    // Then set up the interval
    logger.info(`Setting up polling interval: ${pollingIntervalMs}ms`);
    const intervalId = setInterval(pollEvents, pollingIntervalMs);

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
