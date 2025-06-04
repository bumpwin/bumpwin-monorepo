import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@workspace/logger";
import { type Result, err, ok } from "neverthrow";
import type { ApiError } from "./error";
import { createApiError } from "./error";

interface UploadAvatarParams {
  file: File;
  userId: string;
}

export async function uploadAvatar(
  client: SupabaseClient,
  params: UploadAvatarParams,
): Promise<Result<string, ApiError>> {
  try {
    const { file, userId } = params;

    // Validate file
    // const validationResult = validateAvatar(file)
    // if (validationResult.isErr()) {
    //   return err(validationResult.error)
    // }

    // Create file path
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/${userId}_${Date.now()}.${fileExt}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload file
    const { error: uploadError } = await client.storage.from("avatars").upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

    if (uploadError) {
      logger.error("Failed to upload avatar", { error: uploadError });
      return err(createApiError("database", "Failed to upload avatar", uploadError));
    }

    // Get public URL
    const { data: urlData } = client.storage.from("avatars").getPublicUrl(filePath);

    return ok(urlData.publicUrl);
  } catch (error) {
    logger.error("Unexpected error in avatar upload", { error });
    return err(
      createApiError(
        "unknown",
        error instanceof Error ? error.message : "Unknown error occurred",
        error,
      ),
    );
  }
}
