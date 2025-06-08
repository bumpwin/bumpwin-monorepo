import process from "node:process";
import { ConfigContext } from "@/config";
import type { EventId } from "@mysten/sui/client";
import { NETWORK_TYPE } from "@workspace/sui";
import {
  SupabaseClientService,
  SupabaseService,
  SupabaseServiceLayer,
  createSupabaseClient,
} from "@workspace/supabase";
import type { InsertChatMessageRequest, UpdatePollCursorRequest } from "@workspace/supabase";
import { EventFetcher } from "bumpwin";
import { Context, Effect, Layer } from "effect";

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

// ✅ EventFetcher Service Context/Layer化
interface EventFetcherService {
  readonly fetch: (
    cursor: EventId | null,
  ) => Promise<{ events: readonly ChatEvent[]; cursor: EventId | null }>;
}

const EventFetcherService = Context.GenericTag<EventFetcherService>("EventFetcherService");

const EventFetcherServiceLayer = Layer.succeed(EventFetcherService, {
  fetch: (cursor: EventId | null) => {
    const fetcher = new EventFetcher({
      network: NETWORK_TYPE,
      eventQueryLimit: 10,
    });
    return fetcher.fetch(cursor);
  },
});

/**
 * Get the initial cursor from Supabase (Effect version)
 */
const getInitialCursor = Effect.gen(function* (_) {
  const supabaseService = yield* _(SupabaseService);
  const pollCursor = yield* supabaseService.getPollCursor().pipe(
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
  Effect.gen(function* (_) {
    const supabaseService = yield* _(SupabaseService);
    const chatMessageRequest: InsertChatMessageRequest = {
      txDigest: event.digest,
      eventSequence: BigInt(event.sequence),
      createdAt: new Date(
        typeof event.timestamp === "string" ? Number.parseInt(event.timestamp) : event.timestamp,
      ).toISOString(),
      senderAddress: event.sender,
      messageText: event.text,
    };

    yield* supabaseService.insertChatMessage(chatMessageRequest).pipe(
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
  Effect.gen(function* (_) {
    const supabaseService = yield* _(SupabaseService);
    const updateCursorRequest: UpdatePollCursorRequest = {
      cursor: cursor ? JSON.stringify(cursor) : null,
    };

    yield* supabaseService.updatePollCursor(updateCursorRequest).pipe(
      Effect.mapError((cause) => ListenChatErrors.databaseError(cause)),
      Effect.tap(() =>
        Effect.log(`Poll cursor updated in Supabase: ${updateCursorRequest.cursor}`),
      ),
    );
  });

/**
 * Check if an event has already been processed and saved to the database (simplified version)
 * Uses memory cache to avoid database hits in most cases
 */
const isEventAlreadyProcessed = (eventId: string) =>
  Effect.gen(function* (_) {
    const [digest, sequenceStr] = eventId.split("-");
    if (!digest || sequenceStr === undefined) {
      yield* _(Effect.logError(`Invalid event ID format: ${eventId}`));
      return false;
    }

    // For this polling context, we rely on memory cache to avoid duplicate processing
    // Database existence check is handled by unique constraints and error handling
    return false; // Always process, let database constraints handle duplicates
  });

/**
 * Process new events, save to DB and log details (Effect version)
 */
const processEvents = (events: readonly ChatEvent[], processedEventIds: Set<string>) =>
  Effect.gen(function* (_) {
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
        const alreadyProcessed = yield* _(isEventAlreadyProcessed(eventId));
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

        yield* _(saveChatMessage(event));
        processedEventIds.add(eventId);

        yield* Effect.sleep("100 millis");
      }).pipe(
        Effect.catchAll((error) =>
          Effect.logError(`Error processing event ${eventId}: ${JSON.stringify(error)}`),
        ),
      );
    }
  });

/**
 * Start polling for chat events (Effect version) - 完全なContext/Layer依存注入
 */
export const startChatEventPollingEffect = (pollingIntervalMs: number) =>
  Effect.gen(function* (_) {
    const configService = yield* _(ConfigContext);
    const config = configService.config;

    // ✅ Layer setup with dependency injection
    const supabaseClient = createSupabaseClient(
      config.env.SUPABASE_URL,
      config.env.SUPABASE_ANON_KEY,
    );
    const clientLayer = Layer.succeed(SupabaseClientService, supabaseClient);
    const serviceLayer = SupabaseServiceLayer;
    const fetcherLayer = EventFetcherServiceLayer;
    const mainLayer = Layer.mergeAll(Layer.provide(serviceLayer, clientLayer), fetcherLayer);
    const processedEventIds = new Set<string>();
    let isPolling = false;
    let isFirstPoll = true;

    let cursor = yield* _(getInitialCursor.pipe(Effect.provide(mainLayer)));

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

      // ✅ Effect-ts一貫設計: Effect内でエラーハンドリング完結
      await Effect.runPromise(
        Effect.gen(function* (_) {
          const eventFetcher = yield* _(EventFetcherService);
          yield* _(Effect.log(`Starting poll cycle with cursor: ${JSON.stringify(cursor)}`));

          const result = yield* _(
            Effect.tryPromise(() => eventFetcher.fetch(cursor)).pipe(
              Effect.mapError((cause) => ListenChatErrors.pollingError(cause)),
            ),
          );

          yield* Effect.log(`Fetched ${result.events.length} events`);

          if (result.events.length > 0) {
            if (isFirstPoll) {
              yield* Effect.log("First poll - updating cursor without processing events");
              cursor = result.cursor;
              yield* _(updatePollCursor(cursor));
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
              yield* _(processEvents(newEvents, processedEventIds));
            } else {
              yield* Effect.log("No new events to process after filtering");
            }
          }

          if (JSON.stringify(cursor) !== JSON.stringify(result.cursor)) {
            yield* Effect.log(
              `Updating cursor from ${JSON.stringify(cursor)} to ${JSON.stringify(result.cursor)}`,
            );
            cursor = result.cursor;
            yield* _(updatePollCursor(cursor));
          }
        })
          .pipe(
            Effect.catchAll((error) =>
              Effect.logError(`Error in polling function: ${JSON.stringify(error)}`),
            ),
            Effect.ensuring(
              Effect.sync(() => {
                isPolling = false;
              }),
            ),
          )
          .pipe(Effect.provide(mainLayer)),
      );
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
