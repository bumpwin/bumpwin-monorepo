import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "@workspace/logger";
import { createSupabaseClient, createSupabaseRepository } from "@workspace/supabase";
import type { ApiError } from "@workspace/supabase";
import { ApiErrors, getErrorStatusCode } from "@workspace/supabase";
import type { DbRepository } from "@workspace/supabase";
import { Effect } from "effect";

let supabaseRepo: DbRepository | null = null;

// Factory function to create repository with provided config
export const createChatApiWithConfig = (supabaseUrl: string, supabaseAnonKey: string) => {
  const client = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  const repo = createSupabaseRepository(client);

  return repo;
};

// Get repository - requires external configuration
const getRepo = (
  supabaseUrl?: string,
  supabaseAnonKey?: string,
): Effect.Effect<DbRepository, ApiError> =>
  Effect.gen(function* () {
    if (supabaseRepo) return supabaseRepo;

    if (!supabaseUrl || !supabaseAnonKey) {
      return yield* Effect.fail(
        ApiErrors.config(
          "Supabase configuration not provided",
          "Chat API requires Supabase URL and anon key to be provided",
        ),
      );
    }

    supabaseRepo = createChatApiWithConfig(supabaseUrl, supabaseAnonKey);
    return supabaseRepo;
  });

const parseLimit = (limitParam: string | undefined): Effect.Effect<number, ApiError> => {
  if (!limitParam) return Effect.succeed(40); // Default to 40 messages

  const limit = Number.parseInt(limitParam, 10);
  if (Number.isNaN(limit) || limit < 1) {
    return Effect.fail(
      ApiErrors.validation("Invalid limit parameter", "Limit must be a positive number"),
    );
  }

  return Effect.succeed(limit);
};

/**
 * Create chat API router with Supabase configuration
 * This factory function allows the app to provide its own Supabase config
 */
export const createChatApi = (supabaseUrl: string, supabaseAnonKey: string) => {
  return new OpenAPIHono().get("/", async (c) => {
    const program = Effect.gen(function* () {
      const repo = yield* getRepo(supabaseUrl, supabaseAnonKey);
      const limit = yield* parseLimit(c.req.query("limit"));

      logger.info("Fetching chat messages", { limit });

      // Repository now returns Effect directly
      const chatMessages = yield* repo.getLatestChatMessages({ limit });

      logger.info("Chat messages fetched successfully", {
        count: chatMessages.length,
      });

      return chatMessages;
    });

    const result = await Effect.runPromise(
      Effect.catchAll(program, (error: ApiError) => {
        logger.error("API error", { error });
        const statusCode = getErrorStatusCode(error);
        return Effect.succeed({
          error: error.message,
          details: error.details,
          statusCode,
        });
      }),
    );

    if ("error" in result) {
      return c.json(
        {
          error: result.error,
          details: result.details,
        },
        result.statusCode as unknown as 500,
      );
    }

    return c.json(result);
  });
};

/**
 * Legacy default export - requires env vars to be set externally
 * @deprecated Use createChatApi factory function instead
 */
export const chatApi = createChatApi(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);
