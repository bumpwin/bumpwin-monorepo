import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@workspace/logger";
import { type Result, err, ok } from "neverthrow";
import { chatHistoryModelToDomain, pollCursorModelToDomain, profileModelToDomain } from "./domain";
import type { ApiError } from "./error";
import { createApiError } from "./error";
import { authenticateUser } from "./middleware";
import type { DbRepository } from "./repository";
import { uploadAvatar } from "./storage";
import type {
  GetLatestChatMessagesRequest,
  GetLatestChatMessagesResponse,
  GetPollCursorResponse,
  GetProfileByIdRequest,
  GetProfileByIdResponse,
  InsertChatMessageRequest,
  InsertChatMessageResponse,
  UpdatePollCursorRequest,
  UpdatePollCursorResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "./types";

export class SupabaseRepository implements DbRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findProfileById(
    request: GetProfileByIdRequest,
  ): Promise<Result<GetProfileByIdResponse, ApiError>> {
    try {
      logger.info("Fetching profile", { id: request.userId });
      const { data, error } = await this.client
        .from("profiles")
        .select("*")
        .eq("id", request.userId)
        .single();

      if (error) {
        return err(createApiError("database", error.message, error));
      }

      if (!data) {
        return err(createApiError("not_found", `Profile with id ${request.userId} not found`));
      }

      return ok(profileModelToDomain(data) as GetProfileByIdResponse);
    } catch (error) {
      logger.error("Failed to fetch profile", { id: request.userId, error });
      return err(
        createApiError(
          "unknown",
          error instanceof Error ? error.message : "Unknown error occurred",
          error,
        ),
      );
    }
  }

  async updateProfile(
    request: UpdateProfileRequest,
  ): Promise<Result<UpdateProfileResponse, ApiError>> {
    try {
      // Authenticate user
      const authResult = await authenticateUser(this.client);
      if (authResult.isErr()) {
        return err(authResult.error);
      }
      const { user } = authResult.value;

      logger.info("Updating profile", { userId: user.id });

      // Prepare update data
      const updateData: {
        display_name?: string | null;
        avatar_url?: string | null;
        updated_at: string;
      } = {
        updated_at: new Date().toISOString(),
      };

      // Set display_name if provided
      if ("display_name" in request) {
        updateData.display_name = request.display_name;
      }

      // Handle avatar upload if file exists
      if (request.avatar_file) {
        const uploadResult = await uploadAvatar(this.client, {
          file: request.avatar_file,
          userId: user.id,
        });

        if (uploadResult.isErr()) {
          return err(uploadResult.error);
        }

        updateData.avatar_url = uploadResult.value;
      }

      // Update profile with new data
      const { data, error } = await this.client
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        return err(createApiError("database", error.message, error));
      }

      if (!data) {
        return err(createApiError("not_found", `Profile with id ${user.id} not found`));
      }

      const profile = profileModelToDomain(data);
      return ok({
        success: true,
        profile,
      } as UpdateProfileResponse);
    } catch (error) {
      logger.error("Failed to update profile", { error });
      return err(
        createApiError(
          "unknown",
          error instanceof Error ? error.message : "Unknown error occurred",
          error,
        ),
      );
    }
  }

  async insertChatMessage(
    request: InsertChatMessageRequest,
  ): Promise<Result<InsertChatMessageResponse, ApiError>> {
    try {
      logger.info("Inserting chat message", { request });
      const { data, error } = await this.client
        .from("chat_history")
        .insert({
          tx_digest: request.txDigest,
          event_sequence: request.eventSequence.toString(),
          created_at: request.createdAt,
          sender_address: request.senderAddress,
          message_text: request.messageText,
        })
        .select()
        .single();

      if (error) {
        return err(createApiError("database", error.message, error));
      }

      if (!data) {
        return err(createApiError("unknown", "Failed to insert chat message, no data returned"));
      }

      const chatMessage = chatHistoryModelToDomain(data);
      return ok({
        success: true,
        chatMessage,
      } as InsertChatMessageResponse);
    } catch (error) {
      logger.error("Failed to insert chat message", { error });
      return err(
        createApiError(
          "unknown",
          error instanceof Error ? error.message : "Unknown error occurred",
          error,
        ),
      );
    }
  }

  async getLatestChatMessages(
    request: GetLatestChatMessagesRequest,
  ): Promise<Result<GetLatestChatMessagesResponse, ApiError>> {
    try {
      logger.info("Fetching latest chat messages", { limit: request.limit });
      const { data, error } = await this.client
        .from("chat_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(request.limit);

      if (error) {
        return err(createApiError("database", error.message, error));
      }

      if (!data) {
        return ok([]); // No messages found, return empty array
      }

      const chatMessages = data.map(chatHistoryModelToDomain);
      return ok(chatMessages as GetLatestChatMessagesResponse);
    } catch (error) {
      logger.error("Failed to fetch latest chat messages", { error });
      return err(
        createApiError(
          "unknown",
          error instanceof Error ? error.message : "Unknown error occurred",
          error,
        ),
      );
    }
  }

  async getPollCursor(): Promise<Result<GetPollCursorResponse, ApiError>> {
    try {
      logger.info("Fetching poll cursor");
      const { data, error } = await this.client.from("poll_cursor").select("*").single(); // Assuming there's only one row or you want the first

      if (error) {
        // If no rows found, it might not be an error, depends on logic
        // For now, treating as an error if a cursor is expected to always exist
        if (error.code === "PGRST116") {
          // PGRST116: Row not found
          return err(createApiError("not_found", "Poll cursor not found"));
        }
        return err(createApiError("database", error.message, error));
      }

      if (!data) {
        // This case might be redundant if PGRST116 is caught above
        return err(createApiError("not_found", "Poll cursor not found"));
      }

      return ok(pollCursorModelToDomain(data) as GetPollCursorResponse);
    } catch (error) {
      logger.error("Failed to fetch poll cursor", { error });
      return err(
        createApiError(
          "unknown",
          error instanceof Error ? error.message : "Unknown error occurred",
          error,
        ),
      );
    }
  }

  async updatePollCursor(
    request: UpdatePollCursorRequest,
  ): Promise<Result<UpdatePollCursorResponse, ApiError>> {
    try {
      logger.info("Updating poll cursor", { cursor: request.cursor });
      // Assuming 'id' is the primary key and there is a unique row to update.
      // If the table can be empty, upsert might be better.
      // For this example, we assume a row with a known ID (e.g., a boolean or specific value) exists.
      // Let's assume the poll_cursor table has a single row with id = true (as in domain.ts)
      const { data, error } = await this.client
        .from("poll_cursor")
        .update({
          cursor: request.cursor,
          updated_at: new Date().toISOString(),
        })
        .eq("id", true) // Condition to update the specific row
        .select()
        .single();

      if (error) {
        return err(createApiError("database", error.message, error));
      }

      if (!data) {
        // This might happen if the row with id = true doesn't exist
        return err(createApiError("not_found", "Poll cursor entry to update not found"));
      }

      const pollCursor = pollCursorModelToDomain(data);
      return ok({
        success: true,
        pollCursor,
      } as UpdatePollCursorResponse);
    } catch (error) {
      logger.error("Failed to update poll cursor", { error });
      return err(
        createApiError(
          "unknown",
          error instanceof Error ? error.message : "Unknown error occurred",
          error,
        ),
      );
    }
  }
}
