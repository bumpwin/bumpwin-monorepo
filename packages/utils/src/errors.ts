// Simple union type errors - no classes, no Schema.TaggedError
export type ApiError =
  | { readonly _tag: "NotFoundError"; readonly message: string; readonly details?: unknown }
  | { readonly _tag: "ValidationError"; readonly message: string; readonly details?: unknown }
  | { readonly _tag: "DatabaseError"; readonly message: string; readonly details?: unknown }
  | { readonly _tag: "NetworkError"; readonly message: string; readonly details?: unknown }
  | { readonly _tag: "AuthError"; readonly message: string; readonly details?: unknown }
  | { readonly _tag: "ConfigError"; readonly message: string; readonly details?: unknown };

// Error factory functions
export const ApiErrors = {
  notFound: (message: string, details?: unknown): ApiError => ({
    _tag: "NotFoundError",
    message,
    details,
  }),

  validation: (message: string, details?: unknown): ApiError => ({
    _tag: "ValidationError",
    message,
    details,
  }),

  database: (message: string, details?: unknown): ApiError => ({
    _tag: "DatabaseError",
    message,
    details,
  }),

  network: (message: string, details?: unknown): ApiError => ({
    _tag: "NetworkError",
    message,
    details,
  }),

  auth: (message: string, details?: unknown): ApiError => ({
    _tag: "AuthError",
    message,
    details,
  }),

  config: (message: string, details?: unknown): ApiError => ({
    _tag: "ConfigError",
    message,
    details,
  }),
} as const;
