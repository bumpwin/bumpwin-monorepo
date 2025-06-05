import { P, match } from "ts-pattern";

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

// Type guard to check if error is one of our app errors using ts-pattern
export const isAppError = (error: unknown): error is AppErrorUnion => {
  return match(error)
    .with(
      {
        _tag: P.union(
          "AppError",
          "ValidationError",
          "AuthenticationError",
          "AuthorizationError",
          "NotFoundError",
          "RetryableError",
        ),
      },
      () => true,
    )
    .otherwise(() => false);
};

// エラーハンドリングユーティリティ using ts-pattern
export const handleError = (error: unknown): AppError => {
  return match(error as AppErrorUnion | Error | unknown)
    .with({ _tag: "AppError" }, (appError: AppError) => appError)
    .with({ _tag: "ValidationError" }, (validationError: ValidationError) =>
      AppErrors.appError(
        validationError.message,
        validationError.code,
        validationError.statusCode,
        validationError.context,
      ),
    )
    .with({ _tag: "AuthenticationError" }, (authError: AuthenticationError) =>
      AppErrors.appError(
        authError.message,
        authError.code,
        authError.statusCode,
        authError.context,
      ),
    )
    .with({ _tag: "AuthorizationError" }, (authzError: AuthorizationError) =>
      AppErrors.appError(
        authzError.message,
        authzError.code,
        authzError.statusCode,
        authzError.context,
      ),
    )
    .with({ _tag: "NotFoundError" }, (notFoundError: NotFoundError) =>
      AppErrors.appError(
        notFoundError.message,
        notFoundError.code,
        notFoundError.statusCode,
        notFoundError.context,
      ),
    )
    .with({ _tag: "RetryableError" }, (retryableError: RetryableError) =>
      AppErrors.appError(
        retryableError.message,
        retryableError.code,
        retryableError.statusCode,
        retryableError.context,
      ),
    )
    .when(
      (err): err is Error => err instanceof Error,
      (err) =>
        AppErrors.appError(err.message, "INTERNAL_SERVER_ERROR", 500, {
          originalError: err,
        }),
    )
    .otherwise((unknownError) =>
      AppErrors.appError("An unexpected error occurred", "INTERNAL_SERVER_ERROR", 500, {
        originalError: unknownError,
      }),
    );
};
