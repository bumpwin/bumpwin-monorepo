import process from "node:process";
import { supabase } from "@/services/supabase";
import type { EventId } from "@mysten/sui/client";
import { NETWORK_TYPE } from "@workspace/sui";
import { createSupabaseRepository } from "@workspace/supabase";
import type { InsertChatMessageRequest, UpdatePollCursorRequest } from "@workspace/supabase";
import { EventFetcher } from "bumpwin";
import { Effect } from "effect";

// Event type definition
interface ChatEvent {
  readonly digest: string;
  readonly sequence: number;
  readonly timestamp: string | number;
  readonly sender: string;
  readonly text: string;
}

// Simple error types
type ListenChatError = {
  readonly _tag: "PollingError" | "DatabaseError" | "CursorError";
  readonly cause: unknown;
};

// Error factory functions
const ListenChatErrors = {
  pollingError: (cause: unknown): ListenChatError => ({ _tag: "PollingError", cause }),
  databaseError: (cause: unknown): ListenChatError => ({ _tag: "DatabaseError", cause }),
  cursorError: (cause: unknown): ListenChatError => ({ _tag: "CursorError", cause }),
} as const;

// Simple database operations
const dbRepository = createSupabaseRepository(supabase);

// Singleton fetcher
const fetcher = new EventFetcher({
  network: NETWORK_TYPE,
  eventQueryLimit: 10,
});

/**
 * Get the initial cursor from Supabase (Effect version)
 */
const getInitialCursor = Effect.gen(function* () {
  const pollCursor = yield* dbRepository.getPollCursor().pipe(
    Effect.catchAll((error) => {
      if (error._tag === "NotFoundError") {
        return Effect.succeed(null);
      }
      return Effect.fail(ListenChatErrors.cursorError(error));
    }),
  );

  if (!pollCursor) {
    yield* Effect.log("No initial cursor found in Supabase, starting from scratch.");
    return null;
  }

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

    yield* dbRepository.insertChatMessage(chatMessageRequest).pipe(
      Effect.mapError((cause) => ListenChatErrors.databaseError(cause)),
      Effect.tap(() =>
        Effect.log(`Message from ${event.sender} (Digest: ${event.digest}) saved to Supabase.`),
      ),
    );
  });

/**
 * Update poll cursor in Supabase (Effect version)
 */
const updatePollCursor = (cursor: EventId | null) =>
  Effect.gen(function* () {
    const updateCursorRequest: UpdatePollCursorRequest = {
      cursor: cursor ? JSON.stringify(cursor) : null,
    };

    yield* dbRepository.updatePollCursor(updateCursorRequest).pipe(
      Effect.mapError((cause) => ListenChatErrors.databaseError(cause)),
      Effect.tap(() =>
        Effect.log(`Poll cursor updated in Supabase: ${updateCursorRequest.cursor}`),
      ),
    );
  });

/**
 * Check if an event has already been processed and saved to the database (Effect version)
 */
const isEventAlreadyProcessed = (eventId: string) =>
  Effect.gen(function* () {
    const [digest, sequenceStr] = eventId.split("-");
    if (!digest || sequenceStr === undefined) {
      yield* Effect.logError(`Invalid event ID format: ${eventId}`);
      return false;
    }

    const sequence = yield* Effect.try(() => BigInt(sequenceStr)).pipe(
      Effect.mapError((cause) => ListenChatErrors.databaseError(cause)),
    );

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

    const eventsToProcess = [];
    for (const event of events) {
      const eventId = `${event.digest}-${event.sequence}`;

      if (processedEventIds.has(eventId)) {
        yield* Effect.log(`Skipping already processed event in this session: ${eventId}`);
        continue;
      }

      eventsToProcess.push({ event, eventId });
    }

    if (eventsToProcess.length === 0) {
      yield* Effect.log("No events to process after memory cache check");
      return;
    }

    yield* Effect.log(`Checking ${eventsToProcess.length} events against database`);

    for (const { event, eventId } of eventsToProcess) {
      yield* Effect.gen(function* () {
        const alreadyProcessed = yield* isEventAlreadyProcessed(eventId);
        if (alreadyProcessed) {
          yield* Effect.log(`Event ${eventId} already exists in database - skipping`);
          processedEventIds.add(eventId);
          return;
        }

        yield* Effect.log("----------------------------------------");
        yield* Effect.log(`Event: ${eventId}`);
        yield* Effect.log(`Timestamp: ${event.timestamp}`);
        yield* Effect.log(`Sender: ${event.sender}`);
        yield* Effect.log(`Text: "${event.text}"`);

        yield* saveChatMessage(event);
        processedEventIds.add(eventId);

        yield* Effect.sleep("100 millis");
      }).pipe(
        Effect.catchAll((error) =>
          Effect.logError(`Error processing event ${eventId}: ${error._tag}`),
        ),
      );
    }
  });

/**
 * Start polling for chat events (Effect version)
 */
export const startChatEventPollingEffect = (pollingIntervalMs: number) =>
  Effect.gen(function* () {
    const processedEventIds = new Set<string>();
    let isPolling = false;
    let isFirstPoll = true;

    let cursor = yield* getInitialCursor;

    yield* Effect.log("🚀 Starting polling for chat events...");
    yield* Effect.log(`Network: ${NETWORK_TYPE}, Interval: ${pollingIntervalMs}ms`);

    const pollEvents = async () => {
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

            const result = yield* Effect.tryPromise(() => fetcher.fetch(cursor)).pipe(
              Effect.mapError((cause) => ListenChatErrors.pollingError(cause)),
            );

            yield* Effect.log(`Fetched ${result.events.length} events`);

            if (result.events.length > 0) {
              if (isFirstPoll) {
                yield* Effect.log("First poll - updating cursor without processing events");
                cursor = result.cursor;
                yield* updatePollCursor(cursor);
                isFirstPoll = false;
                return;
              }

              const newEvents = result.events.filter((event) => {
                const eventId = `${event.digest}-${event.sequence}`;
                return !processedEventIds.has(eventId);
              });

              if (newEvents.length > 0) {
                yield* Effect.log(
                  `Processing ${newEvents.length} new events of ${result.events.length} total`,
                );
                yield* processEvents(newEvents, processedEventIds);
              } else {
                yield* Effect.log("No new events to process after filtering");
              }
            }

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

    yield* Effect.promise(() => pollEvents());

    const intervalId = yield* Effect.sync(() => {
      return setInterval(pollEvents, pollingIntervalMs);
    });
    yield* Effect.log(`Setting up polling interval: ${pollingIntervalMs}ms`);

    yield* Effect.sync(() => {
      process.on("SIGINT", () => {
        clearInterval(intervalId);
        Effect.runPromise(Effect.log("Shutting down polling script...")).then(() =>
          process.exit(0),
        );
      });

      process.stdin.resume();
    });
  });
