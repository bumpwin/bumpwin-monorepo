/**
 * Common error handling utilities for the application
 */

/**
 * Base error types for consistent error handling
 */
export interface AppError {
  readonly _tag: string;
  readonly message: string;
  readonly cause?: unknown;
}

/**
 * Transaction-related errors
 */
export interface TransactionError extends AppError {
  readonly _tag: "TransactionError";
}

export interface WalletError extends AppError {
  readonly _tag: "WalletError";
}

export interface NetworkError extends AppError {
  readonly _tag: "NetworkError";
}

export interface ValidationError extends AppError {
  readonly _tag: "ValidationError";
  readonly field?: string;
}

/**
 * Error factory functions for consistent error creation
 */
export const createTransactionError = (message: string, cause?: unknown): TransactionError => ({
  _tag: "TransactionError",
  message,
  cause,
});

export const createWalletError = (message: string, cause?: unknown): WalletError => ({
  _tag: "WalletError",
  message,
  cause,
});

export const createNetworkError = (message: string, cause?: unknown): NetworkError => ({
  _tag: "NetworkError",
  message,
  cause,
});

export const createValidationError = (
  message: string,
  field?: string,
  cause?: unknown,
): ValidationError => ({
  _tag: "ValidationError",
  message,
  field,
  cause,
});

/**
 * Error handling utilities
 */
export const isAppError = (error: unknown): error is AppError => {
  return typeof error === "object" && error !== null && "_tag" in error && "message" in error;
};

export const getErrorMessage = (error: unknown): string => {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

/**
 * Error logging utility
 */
export const logError = (error: unknown, context?: string): void => {
  const message = getErrorMessage(error);
  const fullContext = context ? `[${context}] ${message}` : message;

  console.error(fullContext, error);
};
