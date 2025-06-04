// ベースエラークラス
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// バリデーションエラー
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, context);
  }
}

// 認証エラー
export class AuthenticationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "AUTHENTICATION_ERROR", 401, context);
  }
}

// 認可エラー
export class AuthorizationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "AUTHORIZATION_ERROR", 403, context);
  }
}

// リソース未検出エラー
export class NotFoundError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "NOT_FOUND_ERROR", 404, context);
  }
}

// リトライ可能なエラー
export class RetryableError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "RETRYABLE_ERROR", 503, context);
  }
}

// エラーハンドリングユーティリティ
export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, "INTERNAL_SERVER_ERROR", 500, {
      originalError: error,
    });
  }

  return new AppError("An unexpected error occurred", "INTERNAL_SERVER_ERROR", 500, {
    originalError: error,
  });
};
