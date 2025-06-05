// ベースエラー型
export type AppError = {
  readonly _tag: "AppError";
  readonly message: string;
  readonly code: string;
  readonly statusCode: number;
  readonly context?: Record<string, unknown>;
};

// バリデーションエラー
export type ValidationError = {
  readonly _tag: "ValidationError";
  readonly message: string;
  readonly code: "VALIDATION_ERROR";
  readonly statusCode: 400;
  readonly context?: Record<string, unknown>;
};

// 認証エラー
export type AuthenticationError = {
  readonly _tag: "AuthenticationError";
  readonly message: string;
  readonly code: "AUTHENTICATION_ERROR";
  readonly statusCode: 401;
  readonly context?: Record<string, unknown>;
};

// 認可エラー
export type AuthorizationError = {
  readonly _tag: "AuthorizationError";
  readonly message: string;
  readonly code: "AUTHORIZATION_ERROR";
  readonly statusCode: 403;
  readonly context?: Record<string, unknown>;
};

// リソース未検出エラー
export type NotFoundError = {
  readonly _tag: "NotFoundError";
  readonly message: string;
  readonly code: "NOT_FOUND_ERROR";
  readonly statusCode: 404;
  readonly context?: Record<string, unknown>;
};

// リトライ可能なエラー
export type RetryableError = {
  readonly _tag: "RetryableError";
  readonly message: string;
  readonly code: "RETRYABLE_ERROR";
  readonly statusCode: 503;
  readonly context?: Record<string, unknown>;
};

// Error factory functions
export const AppErrors = {
  appError: (
    message: string,
    code: string,
    statusCode = 500,
    context?: Record<string, unknown>,
  ): AppError => ({
    _tag: "AppError",
    message,
    code,
    statusCode,
    context,
  }),

  validationError: (message: string, context?: Record<string, unknown>): ValidationError => ({
    _tag: "ValidationError",
    message,
    code: "VALIDATION_ERROR",
    statusCode: 400,
    context,
  }),

  authenticationError: (
    message: string,
    context?: Record<string, unknown>,
  ): AuthenticationError => ({
    _tag: "AuthenticationError",
    message,
    code: "AUTHENTICATION_ERROR",
    statusCode: 401,
    context,
  }),

  authorizationError: (message: string, context?: Record<string, unknown>): AuthorizationError => ({
    _tag: "AuthorizationError",
    message,
    code: "AUTHORIZATION_ERROR",
    statusCode: 403,
    context,
  }),

  notFoundError: (message: string, context?: Record<string, unknown>): NotFoundError => ({
    _tag: "NotFoundError",
    message,
    code: "NOT_FOUND_ERROR",
    statusCode: 404,
    context,
  }),

  retryableError: (message: string, context?: Record<string, unknown>): RetryableError => ({
    _tag: "RetryableError",
    message,
    code: "RETRYABLE_ERROR",
    statusCode: 503,
    context,
  }),
} as const;

// Union type for all error types
export type AppErrorUnion =
  | AppError
  | ValidationError
  | AuthenticationError
  | AuthorizationError
  | NotFoundError
  | RetryableError;

// Type guard to check if error is one of our app errors
export const isAppError = (error: unknown): error is AppErrorUnion => {
  if (typeof error !== "object" || error === null || !("_tag" in error)) {
    return false;
  }

  const errorWithTag = error as { _tag: unknown };
  return (
    typeof errorWithTag._tag === "string" &&
    [
      "AppError",
      "ValidationError",
      "AuthenticationError",
      "AuthorizationError",
      "NotFoundError",
      "RetryableError",
    ].includes(errorWithTag._tag)
  );
};

// エラーハンドリングユーティリティ
export const handleError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error._tag === "AppError"
      ? error
      : AppErrors.appError(error.message, error.code, error.statusCode, error.context);
  }

  if (error instanceof Error) {
    return AppErrors.appError(error.message, "INTERNAL_SERVER_ERROR", 500, {
      originalError: error,
    });
  }

  return AppErrors.appError("An unexpected error occurred", "INTERNAL_SERVER_ERROR", 500, {
    originalError: error,
  });
};
