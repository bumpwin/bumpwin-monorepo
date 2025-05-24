import { logger as baseLogger } from "@workspace/logger";
import { config } from "../config";

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

// ログフォーマッター
function formatLogMessage(
  level: LogLevel,
  message: string,
  context?: LogContext,
): LogMessage {
  return {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };
}

// 構造化ロガー
export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (config.isDevelopment) {
      baseLogger.debug(
        JSON.stringify(formatLogMessage("debug", message, context)),
      );
    }
  },

  info: (message: string, context?: LogContext) => {
    baseLogger.info(JSON.stringify(formatLogMessage("info", message, context)));
  },

  warn: (message: string, context?: LogContext) => {
    baseLogger.warn(JSON.stringify(formatLogMessage("warn", message, context)));
  },

  error: (message: string, error?: Error, context?: LogContext) => {
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
    baseLogger.error(
      JSON.stringify(formatLogMessage("error", message, errorContext)),
    );
  },
};
