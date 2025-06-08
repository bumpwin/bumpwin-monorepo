// ✅ Effect-ts推奨: Context/Layer依存注入パターン
// PRACTICES/effect.md準拠 - グローバル依存を排除

import type { Config } from "@/config";
import { logger as baseLogger } from "@workspace/logger";
import { Context, Effect, Layer } from "effect";

// ログレベルの型定義
export type LogLevel = "debug" | "info" | "warn" | "error";

// ログコンテキストの型定義
export interface LogContext {
  [key: string]: unknown;
}

// ログメッセージの型定義
export interface LogMessage {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: string;
}

// ✅ Logger Service定義
export interface LoggerService {
  readonly debug: (message: string, context?: LogContext) => Effect.Effect<void>;
  readonly info: (message: string, context?: LogContext) => Effect.Effect<void>;
  readonly warn: (message: string, context?: LogContext) => Effect.Effect<void>;
  readonly error: (message: string, error?: Error, context?: LogContext) => Effect.Effect<void>;
}

export const LoggerService = Context.GenericTag<LoggerService>("LoggerService");

// ログフォーマッター
const formatLogMessage = (level: LogLevel, message: string, context?: LogContext): LogMessage => ({
  level,
  message,
  context,
  timestamp: new Date().toISOString(),
});

// ✅ Logger Service Layer
export const LoggerServiceLayer = Layer.effect(
  LoggerService,
  Effect.gen(function* () {
    const configService = Context.GenericTag<{ config: Config }>("ConfigService");
    const config = yield* configService;

    return {
      debug: (message: string, context?: LogContext) =>
        Effect.sync(() => {
          if (config.config.isDevelopment) {
            baseLogger.debug(JSON.stringify(formatLogMessage("debug", message, context)));
          }
        }),

      info: (message: string, context?: LogContext) =>
        Effect.sync(() => {
          baseLogger.info(JSON.stringify(formatLogMessage("info", message, context)));
        }),

      warn: (message: string, context?: LogContext) =>
        Effect.sync(() => {
          baseLogger.warn(JSON.stringify(formatLogMessage("warn", message, context)));
        }),

      error: (message: string, error?: Error, context?: LogContext) =>
        Effect.sync(() => {
          const errorContext = {
            ...context,
            error: error
              ? {
                  name: error.name,
                  message: error.message,
                  stack: error.stack,
                }
              : undefined,
          };
          baseLogger.error(JSON.stringify(formatLogMessage("error", message, errorContext)));
        }),
    };
  }),
);
