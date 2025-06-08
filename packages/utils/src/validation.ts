import { Effect } from "effect";
import { z } from "zod";
import type { ApiError } from "./errors";
import { ApiErrors } from "./errors";

/**
 * Generic Zod validation utility using Effect-ts
 * Validates data against a schema and returns typed result or ApiError
 */
export const validateWithSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): Effect.Effect<T, ApiError> =>
  Effect.gen(function* () {
    const result = yield* Effect.try({
      try: () => schema.parse(data),
      catch: (error) => {
        if (error instanceof z.ZodError) {
          return ApiErrors.validation(
            `Validation failed: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
            error.errors,
          );
        }
        return ApiErrors.validation("Unknown validation error", error);
      },
    });

    return result;
  });

/**
 * Safe parse with Effect - doesn't throw on validation failure
 */
export const safeParseWithSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): Effect.Effect<z.SafeParseSuccess<T>, z.SafeParseError<unknown>> =>
  Effect.gen(function* () {
    const result = yield* Effect.sync(() => schema.safeParse(data));

    if (result.success) {
      return result as z.SafeParseSuccess<T>;
    }

    return yield* Effect.fail(result as z.SafeParseError<unknown>);
  });

/**
 * Environment variable validation utility (Effect version)
 */
export const validateEnv = <T>(
  schema: z.ZodSchema<T>,
  env: Record<string, string | undefined>,
): Effect.Effect<T, ApiError> => validateWithSchema(schema, env);

/**
 * Environment variable validation utility (Synchronous version)
 * For legacy compatibility and simple use cases
 */
export const validateEnvSync = <T>(
  schema: z.ZodSchema<T>,
  env: Record<string, string | undefined>,
): T => {
  const result = schema.safeParse(env);

  if (!result.success) {
    throw new Error(
      `Environment validation failed: ${result.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ")}`,
    );
  }

  return result.data;
};

/**
 * JSON validation utility
 */
export const validateJson = <T>(
  schema: z.ZodSchema<T>,
  jsonString: string,
): Effect.Effect<T, ApiError> =>
  Effect.gen(function* () {
    const parsed = yield* Effect.try({
      try: () => JSON.parse(jsonString),
      catch: (error) => ApiErrors.validation("Invalid JSON format", error),
    });

    return yield* validateWithSchema(schema, parsed);
  });

/**
 * Array validation utility
 */
export const validateArray = <T>(
  itemSchema: z.ZodSchema<T>,
  data: unknown[],
): Effect.Effect<T[], ApiError> => validateWithSchema(z.array(itemSchema), data);

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  nonEmptyString: z.string().min(1, "String cannot be empty"),
  positiveNumber: z.number().positive("Number must be positive"),
  email: z.string().email("Invalid email format"),
  url: z.string().url("Invalid URL format"),
  uuid: z.string().uuid("Invalid UUID format"),
  dateString: z.string().datetime("Invalid datetime format"),
} as const;

/**
 * Runtime type checking utility
 */
export const assertType = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage?: string,
): Effect.Effect<T, ApiError> =>
  Effect.gen(function* () {
    return yield* validateWithSchema(schema, data).pipe(
      Effect.mapError((error) =>
        errorMessage ? ApiErrors.validation(errorMessage, error.details) : error,
      ),
    );
  });
