// ✅ Effect-ts推奨: 実装優先型推論パターン
// PRACTICES/effect.md準拠 - 一度だけ定義、型推論に委ねる
// ✅ ts-pattern除去: Effect.catchTagとの二重定義を回避

export const AppErrors = {
  appError: (
    message: string,
    code: string,
    statusCode = 500,
    context?: Record<string, unknown>,
  ) => ({
    _tag: "AppError" as const,
    message,
    code,
    statusCode,
    context,
  }),

  validationError: (message: string, context?: Record<string, unknown>) => ({
    _tag: "ValidationError" as const,
    message,
    code: "VALIDATION_ERROR" as const,
    statusCode: 400 as const,
    context,
  }),

  authenticationError: (message: string, context?: Record<string, unknown>) => ({
    _tag: "AuthenticationError" as const,
    message,
    code: "AUTHENTICATION_ERROR" as const,
    statusCode: 401 as const,
    context,
  }),

  authorizationError: (message: string, context?: Record<string, unknown>) => ({
    _tag: "AuthorizationError" as const,
    message,
    code: "AUTHORIZATION_ERROR" as const,
    statusCode: 403 as const,
    context,
  }),

  notFoundError: (message: string, context?: Record<string, unknown>) => ({
    _tag: "NotFoundError" as const,
    message,
    code: "NOT_FOUND_ERROR" as const,
    statusCode: 404 as const,
    context,
  }),

  retryableError: (message: string, context?: Record<string, unknown>) => ({
    _tag: "RetryableError" as const,
    message,
    code: "RETRYABLE_ERROR" as const,
    statusCode: 503 as const,
    context,
  }),
} as const;

// ✅ 型推論から自動生成 - 二重記述なし
export type AppError = ReturnType<(typeof AppErrors)[keyof typeof AppErrors]>;

// 個別型が必要な場合の型推論
export type ValidationError = ReturnType<typeof AppErrors.validationError>;
export type AuthenticationError = ReturnType<typeof AppErrors.authenticationError>;
export type AuthorizationError = ReturnType<typeof AppErrors.authorizationError>;
export type NotFoundError = ReturnType<typeof AppErrors.notFoundError>;
export type RetryableError = ReturnType<typeof AppErrors.retryableError>;

// Union type for all error types (互換性維持)
export type AppErrorUnion = AppError;

// ✅ Effect-ts一貫設計: TypeScriptの型チェックを活用
export const isAppError = (error: unknown): error is AppError => {
  if (typeof error !== "object" || error === null || !("_tag" in error)) {
    return false;
  }

  const tag = (error as { _tag: unknown })._tag;
  return (
    tag === "AppError" ||
    tag === "ValidationError" ||
    tag === "AuthenticationError" ||
    tag === "AuthorizationError" ||
    tag === "NotFoundError" ||
    tag === "RetryableError"
  );
};

// ✅ handleError関数は削除済み
// Effect外エラーハンドリングはアンチパターンのため除去
// 代わりにEffect内でのEffect.catchTagを使用してください
//
// 推奨パターン例:
// const safeOperation = <R, E, A>(effect: Effect.Effect<R, E, A>) =>
//   effect.pipe(
//     Effect.catchTag("ValidationError", (error) =>
//       Effect.succeed({ success: false, error: "VALIDATION_ERROR", field: error.field })
//     ),
//     Effect.catchTag("AuthenticationError", (error) =>
//       Effect.succeed({ success: false, error: "AUTHENTICATION_ERROR", details: error.message })
//     ),
//     Effect.catchAll((error) =>
//       Effect.succeed({ success: false, error: "UNKNOWN_ERROR", message: String(error) })
//     )
//   )
