import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@workspace/logger";
import { Effect } from "effect";
import type { ApiError } from "./error";
import { createApiError } from "./error";

interface UploadAvatarParams {
  file: File;
  userId: string;
}

export function uploadAvatar(
  client: SupabaseClient,
  params: UploadAvatarParams,
): Effect.Effect<string, ApiError> {
  return Effect.gen(function* () {
    const { file, userId } = params;

    // Validate file
    // const validationResult = validateAvatar(file)
    // if (validationResult.isErr()) {
    //   return yield* Effect.fail(validationResult.error)
    // }

    // Create file path
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/${userId}_${Date.now()}.${fileExt}`;

    // Convert file to buffer
    const arrayBuffer = yield* Effect.tryPromise({
      try: () => file.arrayBuffer(),
      catch: (error) =>
        createApiError(
          "unknown",
          error instanceof Error ? error.message : "Failed to read file",
          error,
        ),
    });
    const buffer = new Uint8Array(arrayBuffer);

    // Upload file
    const { error: uploadError } = yield* Effect.tryPromise({
      try: () =>
        client.storage.from("avatars").upload(filePath, buffer, {
          contentType: file.type,
          upsert: true,
        }),
      catch: (error) =>
        createApiError(
          "unknown",
          error instanceof Error ? error.message : "Unknown error occurred",
          error,
        ),
    });

    if (uploadError) {
      logger.error("Failed to upload avatar", { error: uploadError });
      return yield* Effect.fail(createApiError("database", "Failed to upload avatar", uploadError));
    }

    // Get public URL
    const { data: urlData } = client.storage.from("avatars").getPublicUrl(filePath);

    return urlData.publicUrl;
  });
}
