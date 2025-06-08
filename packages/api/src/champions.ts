import { OpenAPIHono } from "@hono/zod-openapi";
import { getChampions, mockMemeMarketData } from "@workspace/mockdata";
import { Context, Effect, Layer } from "effect";

// ✅ LoggerService Context/Layerパターン
interface LoggerService {
  readonly info: (message: string, data?: unknown) => Effect.Effect<void>;
  readonly debug: (message: string, data?: unknown) => Effect.Effect<void>;
}

const LoggerService = Context.GenericTag<LoggerService>("LoggerService");

const LoggerServiceLayer = Layer.succeed(LoggerService, {
  info: (message: string, data?: unknown) =>
    Effect.sync(() => console.info(`[INFO] ${message}`, data)),
  debug: (message: string, data?: unknown) =>
    Effect.sync(() => console.debug(`[DEBUG] ${message}`, data)),
});

export const championsApi = new OpenAPIHono()
  // Get all champions with market data
  .get("/", async (c) => {
    const program = Effect.gen(function* (_) {
      const logger = yield* _(LoggerService);

      const champions = getChampions();
      yield* _(logger.debug("Champions from getChampions()", champions));

      // Enrich with market data
      const enrichedChampions = champions.map(({ round, meme }) => ({
        round,
        meme: meme
          ? {
              ...meme,
              ...mockMemeMarketData[meme.id],
            }
          : null,
      }));

      yield* _(logger.debug("Enriched champions", enrichedChampions));
      return enrichedChampions;
    });

    const result = await Effect.runPromise(program.pipe(Effect.provide(LoggerServiceLayer)));

    return c.json(result);
  });
