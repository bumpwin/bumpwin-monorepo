import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@workspace/logger";
import { Effect } from "effect";
import type { ApiError } from "./error";
import { createApiError } from "./error";

export interface AuthenticatedUser {
  id: string;
}

export interface AuthenticationResult {
  user: AuthenticatedUser;
}

/**
 * Authenticate user with Supabase client
 * @param client - Supabase client instance
 * @returns Effect with authenticated user or error
 */
export function authenticateUser(
  client: SupabaseClient,
): Effect.Effect<AuthenticationResult, ApiError> {
  return Effect.gen(function* () {
    const {
      data: { user },
      error: authError,
    } = yield* Effect.tryPromise({
      try: () => client.auth.getUser(),
      catch: (error) =>
        createApiError(
          "unknown",
          error instanceof Error ? error.message : "Unknown error occurred",
          error,
        ),
    });

    if (authError || !user) {
      logger.error("Authentication failed", { error: authError });
      return yield* Effect.fail(createApiError("unauthorized", "User not authenticated"));
    }

    logger.info("User authenticated", { userId: user.id });
    return { user: { id: user.id } };
  });
}
