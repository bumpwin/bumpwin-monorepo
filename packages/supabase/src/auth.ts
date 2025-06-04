import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@workspace/logger";
import { type Result, err, ok } from "neverthrow";
import type { ApiError } from "./error";
import { createApiError } from "./error";

/**
 * Extract bearer token from authorization header
 */
export function extractBearerToken(authHeader: string | null): Result<string, ApiError> {
  if (!authHeader?.startsWith("Bearer ")) {
    logger.warn("Missing or invalid authorization header");
    return err(createApiError("unauthorized", "Missing or invalid authorization header"));
  }

  return ok(authHeader.substring("Bearer ".length));
}

/**
 * Get current auth session
 * @throws Error if no session is found
 */
export async function getAuthSession(supabase: SupabaseClient): Promise<Session> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    logger.error("Failed to get auth session", { error });
    throw error;
  }
  if (!session) {
    logger.error("No session found");
    throw new Error("No session found");
  }
  return session;
}
