import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@workspace/logger";
import { type Result, err, ok } from "neverthrow";
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
 * @returns Result with authenticated user or error
 */
export async function authenticateUser(
  client: SupabaseClient,
): Promise<Result<AuthenticationResult, ApiError>> {
  try {
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();

    if (authError || !user) {
      logger.error("Authentication failed", { error: authError });
      return err(createApiError("unauthorized", "User not authenticated"));
    }

    logger.info("User authenticated", { userId: user.id });
    return ok({ user: { id: user.id } });
  } catch (error) {
    logger.error("Unexpected error during authentication", { error });
    return err(
      createApiError(
        "unknown",
        error instanceof Error ? error.message : "Unknown error occurred",
        error,
      ),
    );
  }
}
