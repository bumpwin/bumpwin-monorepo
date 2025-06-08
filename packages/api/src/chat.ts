// ✅ Effect-ts推奨: Context/Layer依存注入パターン
// PRACTICES/effect.md準拠 - ミュータブルグローバル状態を排除

import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "@workspace/logger";
import { createSupabaseClient } from "@workspace/supabase";
import type { ApiError, GetLatestChatMessagesResponse } from "@workspace/supabase";
import { ApiErrors, getErrorStatusCode } from "@workspace/supabase";
import { Context, Effect, Layer } from "effect";

// ✅ Effect-ts推奨: Direct Service Pattern (No Repository)
// PRACTICES/effect.md: Repository Patternは二重抽象化のアンチパターン

export interface ChatService {
  readonly getLatestChatMessages: (params: { limit: number }) => Effect.Effect<
    GetLatestChatMessagesResponse,
    ApiError
  >;
}

export const ChatService = Context.GenericTag<ChatService>("ChatService");

// ✅ Chat Service Layer - Direct Supabase実装（Repository層除去）
export const createChatServiceLayer = (supabaseUrl: string, supabaseAnonKey: string) =>
  Layer.succeed(ChatService, {
    getLatestChatMessages: (params) => {
      const client = createSupabaseClient(supabaseUrl, supabaseAnonKey);
      // ✅ Repository層を除去 - 直接Supabase操作
      return Effect.tryPromise({
        try: () =>
          client
            .from("chats")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(params.limit)
            .then((response) => {
              if (response.error) {
                return Promise.reject(response.error);
              }
              return response.data || [];
            }),
        catch: (error) => ApiErrors.database("Failed to fetch chat messages", error),
      });
    },
  });

// ✅ Factory function - Direct Supabase（Repository層除去）
export const createChatApiWithConfig = (supabaseUrl: string, supabaseAnonKey: string) => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

// ✅ Chat Service取得 - Context経由 (No Repository抽象化)
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
 * ✅ Create chat API router - Direct Service Pattern
 * PRACTICES/effect.md準拠: Repository抽象化を除去
 */
export const createChatApi = (supabaseUrl: string, supabaseAnonKey: string) => {
  const chatServiceLayer = createChatServiceLayer(supabaseUrl, supabaseAnonKey);

  return new OpenAPIHono().get("/", async (c) => {
    const program = Effect.gen(function* (_) {
      const chatService = yield* _(ChatService);
      const limit = yield* _(parseLimit(c.req.query("limit")));

      logger.info("Fetching chat messages", { limit });

      // Direct service call - no Repository抽象化
      const chatMessages = yield* _(chatService.getLatestChatMessages({ limit }));

      logger.info("Chat messages fetched successfully", {
        count: chatMessages.length,
      });

      return chatMessages;
    });

    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(chatServiceLayer),
        Effect.catchAll((error: ApiError) => {
          logger.error("API error", { error });
          const statusCode = getErrorStatusCode(error);
          return Effect.succeed({
            error: error.message,
            details: error.details,
            statusCode,
          });
        }),
      ),
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
