// ✅ Effect-ts推奨: 実装優先型推論パターン
// PRACTICES/effect.md準拠 - 一度だけ定義、型推論に委ねる

export const ApiErrors = {
  notFound: (message: string, details?: unknown) => ({
    _tag: "NotFoundError" as const,
    message,
    details,
  }),

  validation: (message: string, details?: unknown) => ({
    _tag: "ValidationError" as const,
    message,
    details,
  }),

  database: (message: string, details?: unknown) => ({
    _tag: "DatabaseError" as const,
    message,
    details,
  }),

  network: (message: string, details?: unknown) => ({
    _tag: "NetworkError" as const,
    message,
    details,
  }),

  auth: (message: string, details?: unknown) => ({
    _tag: "AuthError" as const,
    message,
    details,
  }),

  config: (message: string, details?: unknown) => ({
    _tag: "ConfigError" as const,
    message,
    details,
  }),

  unknown: (message: string, details?: unknown) => ({
    _tag: "UnknownError" as const,
    message,
    details,
  }),
} as const;

// ✅ 型推論から自動生成 - 二重記述なし
export type ApiError = ReturnType<(typeof ApiErrors)[keyof typeof ApiErrors]>;
