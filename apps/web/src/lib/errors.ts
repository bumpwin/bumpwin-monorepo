/**
 * Effect-ts compliant error handling system
 * Using implementation-first type inference pattern
 */

import { Context, Effect } from "effect";

// ✅ LoggerService Context定義
interface LoggerService {
  readonly error: (message: string, data?: unknown) => Effect.Effect<void>;
  readonly warn: (message: string, data?: unknown) => Effect.Effect<void>;
  readonly info: (message: string, data?: unknown) => Effect.Effect<void>;
}

const LoggerService = Context.GenericTag<LoggerService>("LoggerService");

/**
 * ✅ Application Error Factory - Implementation First Pattern
 * All errors are defined once using factory functions, types are inferred
 */
export const AppErrors = {
  transaction: (message: string, cause?: unknown) => ({
    _tag: "TransactionError" as const,
    message,
    cause,
  }),

  wallet: (message: string, cause?: unknown) => ({
    _tag: "WalletError" as const,
    message,
    cause,
  }),

  network: (message: string, cause?: unknown) => ({
    _tag: "NetworkError" as const,
    message,
    cause,
  }),

  validation: (message: string, field?: string, cause?: unknown) => ({
    _tag: "ValidationError" as const,
    message,
    field,
    cause,
  }),

  database: (message: string, cause?: unknown) => ({
    _tag: "DatabaseError" as const,
    message,
    cause,
  }),

  authentication: (message: string, cause?: unknown) => ({
    _tag: "AuthenticationError" as const,
    message,
    cause,
  }),

  authorization: (message: string, resource?: string, cause?: unknown) => ({
    _tag: "AuthorizationError" as const,
    message,
    resource,
    cause,
  }),

  notFound: (resource: string, id?: string, cause?: unknown) => ({
    _tag: "NotFoundError" as const,
    message: `${resource} not found${id ? `: ${id}` : ""}`,
    resource,
    id,
    cause,
  }),

  conflict: (message: string, conflictingValue?: string, cause?: unknown) => ({
    _tag: "ConflictError" as const,
    message,
    conflictingValue,
    cause,
  }),

  rateLimit: (limit: number, resetTime?: Date, cause?: unknown) => ({
    _tag: "RateLimitError" as const,
    message: `Rate limit exceeded: ${limit} requests`,
    limit,
    resetTime,
    cause,
  }),
} as const;

/**
 * ✅ Type inference from implementation - no double declaration
 */
export type AppError = ReturnType<(typeof AppErrors)[keyof typeof AppErrors]>;

/**
 * ✅ Error type guards using discriminated unions
 */
export const isAppError = (error: unknown): error is AppError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "_tag" in error &&
    "message" in error &&
    typeof (error as { _tag: unknown })._tag === "string" &&
    typeof (error as { message: unknown }).message === "string"
  );
};

export const isTransactionError = (
  error: AppError,
): error is ReturnType<typeof AppErrors.transaction> => error._tag === "TransactionError";

export const isWalletError = (error: AppError): error is ReturnType<typeof AppErrors.wallet> =>
  error._tag === "WalletError";

export const isNetworkError = (error: AppError): error is ReturnType<typeof AppErrors.network> =>
  error._tag === "NetworkError";

export const isValidationError = (
  error: AppError,
): error is ReturnType<typeof AppErrors.validation> => error._tag === "ValidationError";

export const isDatabaseError = (error: AppError): error is ReturnType<typeof AppErrors.database> =>
  error._tag === "DatabaseError";

export const isNotFoundError = (error: AppError): error is ReturnType<typeof AppErrors.notFound> =>
  error._tag === "NotFoundError";

/**
 * ✅ Error message extraction utility
 */
export const getErrorMessage = (error: unknown): string => {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
};

/**
 * ✅ Effect-based error logging with LoggerService
 */
export const logErrorEffect = (
  error: unknown,
  context?: string,
  metadata?: Record<string, unknown>,
) =>
  Effect.gen(function* (_) {
    const logger = yield* _(LoggerService);
    const message = getErrorMessage(error);
    const fullContext = context ? `[${context}] ${message}` : message;

    if (isAppError(error)) {
      yield* _(
        logger.error(fullContext, {
          tag: error._tag,
          message: error.message,
          cause: error.cause,
          metadata,
          ...error,
        }),
      );
    } else {
      yield* _(logger.error(fullContext, { error, metadata }));
    }
  });

// Export LoggerService for use in other modules
export { LoggerService };

/**
 * ✅ Error serialization for API responses
 */
export const serializeError = (error: AppError): Record<string, unknown> => ({
  type: error._tag,
  message: error.message,
  ...(error.cause && { cause: String(error.cause) }),
  ...("field" in error && error.field && { field: error.field }),
  ...("resource" in error && error.resource && { resource: error.resource }),
  ...("id" in error && error.id && { id: error.id }),
  ...("limit" in error && error.limit && { limit: error.limit }),
  ...("resetTime" in error && error.resetTime && { resetTime: error.resetTime?.toISOString() }),
});

/**
 * ✅ Common error handling patterns for Effect-ts
 */
export const formatErrorForUser = (error: AppError): string => {
  switch (error._tag) {
    case "ValidationError":
      return error.field
        ? `Invalid ${error.field}: ${error.message}`
        : `Validation error: ${error.message}`;
    case "NotFoundError":
      return `${error.resource} not found`;
    case "AuthenticationError":
      return "Please sign in to continue";
    case "AuthorizationError":
      return "You don't have permission to perform this action";
    case "RateLimitError":
      return "Too many requests. Please try again later";
    case "NetworkError":
      return "Network connection failed. Please check your internet connection";
    case "TransactionError":
      return "Transaction failed. Please try again";
    case "WalletError":
      return "Wallet connection error. Please reconnect your wallet";
    case "DatabaseError":
      return "A server error occurred. Please try again";
    case "ConflictError":
      return error.message;
    default:
      return "An unexpected error occurred";
  }
};
