import process from "node:process";
import { supabase } from "@/services/supabase";
import type { EventId } from "@mysten/sui/client";
import { NETWORK_TYPE } from "@workspace/sui";
import { SupabaseRepository } from "@workspace/supabase";
import type {
  GetPollCursorResponse,
  InsertChatMessageRequest,
  UpdatePollCursorRequest,
} from "@workspace/supabase";
import { Effect } from "effect";

// Event type definition
interface ChatEvent {
  readonly digest: string;
  readonly sequence: number;
  readonly timestamp: string | number;
  readonly sender: string;
  readonly text: string;
}

// Effect Error types using union types (avoiding classes)
type PollingError = {
  readonly _tag: "PollingError";
  readonly cause: unknown;
};

type DatabaseError = {
  readonly _tag: "DatabaseError";
  readonly cause: unknown;
};

type CursorError = {
  readonly _tag: "CursorError";
  readonly cause: unknown;
};

// Error factory functions
const ListenChatErrors = {
  pollingError: (cause: unknown): PollingError => ({
    _tag: "PollingError",
    cause,
  }),

  databaseError: (cause: unknown): DatabaseError => ({
    _tag: "DatabaseError",
    cause,
  }),

  cursorError: (cause: unknown): CursorError => ({
    _tag: "CursorError",
    cause,
  }),
} as const;

import { EventFetcher } from "bumpwin";

const dbRepository = new SupabaseRepository(supabase);

// Singleton fetcher
const fetcher = new EventFetcher({
  network: NETWORK_TYPE,
  eventQueryLimit: 10,
});

/**
 * Get the initial cursor from Supabase (Effect version)
 */
const getInitialCursor = Effect.gen(function* () {
  const cursorResult = yield* Effect.tryPromise(() => dbRepository.getPollCursor()).pipe(
    Effect.mapError((cause) => ListenChatErrors.cursorError(cause)),
  );

  // Handle neverthrow Result in Effect way - check if result is success
  if ("isOk" in cursorResult && !cursorResult.isOk()) {
    if ("error" in cursorResult && cursorResult.error.type === "not_found") {
      yield* Effect.log("No initial cursor found in Supabase, starting from scratch.");
      return null;
    }
    yield* Effect.fail(ListenChatErrors.cursorError(cursorResult));
  }

  // Extract value safely
  const pollCursor = (
    "value" in cursorResult ? cursorResult.value : cursorResult
  ) as GetPollCursorResponse;
  if (!pollCursor.cursor) {
    yield* Effect.log("Cursor exists but is null, starting from scratch.");
    return null;
  }

  const cursor = yield* Effect.try(() => JSON.parse(pollCursor.cursor) as EventId).pipe(
    Effect.mapError((cause) => ListenChatErrors.cursorError(cause)),
  );

  yield* Effect.log(`Initial cursor loaded from Supabase: ${pollCursor.cursor}`);
  return cursor;
});

/**
 * Save chat message to Supabase (Effect version)
 */
const saveChatMessage = (event: ChatEvent) =>
  Effect.gen(function* () {
    const chatMessageRequest: InsertChatMessageRequest = {
      txDigest: event.digest,
      eventSequence: BigInt(event.sequence),
      createdAt: new Date(
        typeof event.timestamp === "string" ? Number.parseInt(event.timestamp) : event.timestamp,
      ).toISOString(),
      senderAddress: event.sender,
      messageText: event.text,
    };

    const insertResult = yield* Effect.tryPromise(() =>
      dbRepository.insertChatMessage(chatMessageRequest),
    ).pipe(Effect.mapError((cause) => ListenChatErrors.databaseError(cause)));

    // Handle neverthrow Result in Effect way
    if ("isOk" in insertResult && insertResult.isOk()) {
      yield* Effect.log(
        `Message from ${event.sender} (Digest: ${event.digest}) saved to Supabase.`,
      );
    } else if ("error" in insertResult) {
      yield* Effect.logError(
        `Failed to save message (Digest: ${event.digest}): ${JSON.stringify(insertResult.error)}`,
      );
      yield* Effect.fail(ListenChatErrors.databaseError(insertResult.error));
    } else {
      // If it's not a neverthrow Result, assume success
      yield* Effect.log(
        `Message from ${event.sender} (Digest: ${event.digest}) saved to Supabase.`,
      );
    }
  });

/**
 * Update poll cursor in Supabase (Effect version)
 */
const updatePollCursor = (cursor: EventId | null) =>
  Effect.gen(function* () {
    const updateCursorRequest: UpdatePollCursorRequest = {
      cursor: cursor ? JSON.stringify(cursor) : null,
    };

    const updateResult = yield* Effect.tryPromise(() =>
      dbRepository.updatePollCursor(updateCursorRequest),
    ).pipe(Effect.mapError((cause) => ListenChatErrors.databaseError(cause)));

    // Handle neverthrow Result in Effect way
    if ("isOk" in updateResult && updateResult.isOk()) {
      yield* Effect.log(`Poll cursor updated in Supabase: ${updateCursorRequest.cursor}`);
    } else if ("error" in updateResult) {
      yield* Effect.logError(`Failed to update poll cursor: ${JSON.stringify(updateResult.error)}`);
      yield* Effect.fail(ListenChatErrors.databaseError(updateResult.error));
    } else {
      // If it's not a neverthrow Result, assume success
      yield* Effect.log(`Poll cursor updated in Supabase: ${updateCursorRequest.cursor}`);
    }
  });

/**
 * Check if an event has already been processed and saved to the database (Effect version)
 */
const isEventAlreadyProcessed = (eventId: string) =>
  Effect.gen(function* () {
    // Split the eventId into digest and sequence
    const [digest, sequenceStr] = eventId.split("-");
    if (!digest || sequenceStr === undefined) {
      yield* Effect.logError(`Invalid event ID format: ${eventId}`);
      return false;
    }

    const sequence = yield* Effect.try(() => BigInt(sequenceStr)).pipe(
      Effect.mapError((cause) => ListenChatErrors.databaseError(cause)),
    );

    // Check if the message exists in the database using a direct query
    const result = yield* Effect.tryPromise(() =>
      supabase
        .from("chat_history")
        .select("id")
        .eq("tx_digest", digest)
        .eq("event_sequence", sequence.toString())
        .limit(1),
    ).pipe(
      Effect.mapError((cause) => ListenChatErrors.databaseError(cause)),
      Effect.catchAll((error) => {
        return Effect.logError(`Error checking if event exists: ${error._tag}`).pipe(
          Effect.andThen(Effect.succeed({ data: null, error: true })),
        );
      }),
    );

    if (result.error) {
      return false;
    }

    return result.data && result.data.length > 0;
  });

/**
 * Process new events, save to DB and log details (Effect version)
 */
const processEvents = (events: readonly ChatEvent[], processedEventIds: Set<string>) =>
  Effect.gen(function* () {
    if (events.length === 0) return;

    yield* Effect.log(`[${new Date().toISOString()}] Processing ${events.length} new event(s)`);

    // First, check all events against the database in a single pass
    const eventsToProcess = [];
    for (const event of events) {
      const eventId = `${event.digest}-${event.sequence}`;

      // Skip if already processed in this session
      if (processedEventIds.has(eventId)) {
        yield* Effect.log(`Skipping already processed event in this session: ${eventId}`);
        continue;
      }

      // Add to list of events to check against DB
      eventsToProcess.push({ event, eventId });
    }

    if (eventsToProcess.length === 0) {
      yield* Effect.log("No events to process after memory cache check");
      return;
    }

    // Check all events against the database
    yield* Effect.log(`Checking ${eventsToProcess.length} events against database`);

    for (const { event, eventId } of eventsToProcess) {
      yield* Effect.gen(function* () {
        // Check if already in database
        const alreadyProcessed = yield* isEventAlreadyProcessed(eventId);
        if (alreadyProcessed) {
          yield* Effect.log(`Event ${eventId} already exists in database - skipping`);
          // Mark as processed in memory to avoid future checks
          processedEventIds.add(eventId);
          return;
        }

        // Log event details
        yield* Effect.log("----------------------------------------");
        yield* Effect.log(`Event: ${eventId}`);
        yield* Effect.log(`Timestamp: ${event.timestamp}`);
        yield* Effect.log(`Sender: ${event.sender}`);
        yield* Effect.log(`Text: "${event.text}"`);

        // Save to database
        yield* saveChatMessage(event);

        // Mark as processed in memory
        processedEventIds.add(eventId);

        // Small delay between processing each event to avoid overwhelming the database
        yield* Effect.sleep("100 millis");
      }).pipe(
        Effect.catchAll((error) =>
          Effect.logError(`Error processing event ${eventId}: ${error._tag}`),
        ),
      );
    }
  });

// Legacy Promise wrapper for compatibility
export const startChatEventPolling = async (pollingIntervalMs: number) => {
  return Effect.runPromise(
    startChatEventPollingEffect(pollingIntervalMs).pipe(
      Effect.catchAll((error) =>
        Effect.logError(`Chat event polling failed: ${error._tag}`).pipe(
          Effect.andThen(Effect.fail(error)),
        ),
      ),
    ),
  );
};

/**
 * Start polling for chat events (Effect version)
 */
export const startChatEventPollingEffect = (pollingIntervalMs: number) =>
  Effect.gen(function* () {
    // Keep track of processed event IDs to avoid duplicates
    const processedEventIds = new Set<string>();

    // Flag to prevent concurrent polling executions
    let isPolling = false;
    // Flag to determine if we've completed first poll
    let isFirstPoll = true;

    // Get the initial cursor from the database
    let cursor = yield* getInitialCursor;

    yield* Effect.log("🚀 Starting polling for chat events...");
    yield* Effect.log(`Network: ${NETWORK_TYPE}, Interval: ${pollingIntervalMs}ms`);

    // Define the polling function separately for better control
    const pollEvents = async () => {
      // Skip if already polling
      if (isPolling) {
        await Effect.runPromise(
          Effect.log("Skipping poll cycle - previous cycle still in progress"),
        );
        return;
      }

      isPolling = true;

      try {
        await Effect.runPromise(
          Effect.gen(function* () {
            yield* Effect.log(`Starting poll cycle with cursor: ${JSON.stringify(cursor)}`);

            // Fetch new events
            const result = yield* Effect.tryPromise(() => fetcher.fetch(cursor)).pipe(
              Effect.mapError((cause) => ListenChatErrors.pollingError(cause)),
            );

            // Check if any events were returned
            yield* Effect.log(`Fetched ${result.events.length} events`);

            if (result.events.length > 0) {
              // On first poll, just save the cursor without processing events
              // This helps when restarting the server to avoid reprocessing old events
              if (isFirstPoll) {
                yield* Effect.log("First poll - updating cursor without processing events");
                cursor = result.cursor;
                yield* updatePollCursor(cursor);
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
                yield* Effect.log(
                  `Processing ${newEvents.length} new events of ${result.events.length} total`,
                );
                yield* processEvents(newEvents, processedEventIds);
              } else {
                yield* Effect.log("No new events to process after filtering");
              }
            }

            // Always update cursor if changed, even if no events to process
            if (JSON.stringify(cursor) !== JSON.stringify(result.cursor)) {
              yield* Effect.log(
                `Updating cursor from ${JSON.stringify(cursor)} to ${JSON.stringify(result.cursor)}`,
              );
              cursor = result.cursor;
              yield* updatePollCursor(cursor);
            }
          }).pipe(
            Effect.catchAll((error) => Effect.logError(`Error in polling function: ${error._tag}`)),
          ),
        );
      } finally {
        isPolling = false;
      }
    };

    // Run the initial poll immediately
    yield* Effect.promise(() => pollEvents());

    // Then set up the interval
    const intervalId = yield* Effect.sync(() => {
      return setInterval(pollEvents, pollingIntervalMs);
    });
    yield* Effect.log(`Setting up polling interval: ${pollingIntervalMs}ms`);

    // Handle graceful shutdown
    yield* Effect.sync(() => {
      process.on("SIGINT", () => {
        clearInterval(intervalId);
        Effect.runPromise(Effect.log("Shutting down polling script...")).then(() =>
          process.exit(0),
        );
      });

      // Keep the process running
      process.stdin.resume();
    });
  });
