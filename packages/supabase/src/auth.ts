import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@workspace/logger";
import { Effect } from "effect";
import type { ApiError } from "./error";
import { ApiErrors } from "./error";

/**
 * Extract bearer token from authorization header
 */
export function extractBearerToken(authHeader: string | null): Effect.Effect<string, ApiError> {
  if (!authHeader?.startsWith("Bearer ")) {
    logger.warn("Missing or invalid authorization header");
    return Effect.fail(ApiErrors.auth("Missing or invalid authorization header"));
  }

  return Effect.succeed(authHeader.substring("Bearer ".length));
}

/**
 * Get current auth session (Effect version)
 * ✅ Preferred - Uses Effect for type-safe error handling
 */
export function getAuthSessionEffect(supabase: SupabaseClient): Effect.Effect<Session, ApiError> {
  return Effect.gen(function* () {
    const result = yield* Effect.tryPromise({
      try: () => supabase.auth.getSession(),
      catch: (error) => ApiErrors.auth("Failed to get auth session", error),
    });

    if (result.error) {
      yield* Effect.logError("Failed to get auth session", { error: result.error });
      return yield* Effect.fail(ApiErrors.auth("Auth session error", result.error));
    }

    if (!result.data.session) {
      yield* Effect.logError("No session found");
      return yield* Effect.fail(ApiErrors.auth("No session found"));
    }

    return result.data.session;
  });
}
