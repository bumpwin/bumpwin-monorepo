import type { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@workspace/logger";
import { Context, Effect, Layer } from "effect";
import { chatHistoryModelToDomain, pollCursorModelToDomain, profileModelToDomain } from "./domain";
import type { ApiError } from "./error";
import { ApiErrors } from "./error";
import { authenticateUser } from "./middleware";
import type { ChatHistoryModel, PollCursorModel, ProfileModel } from "./models";
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

// Service tag for SupabaseClient
export const SupabaseClientService = Context.GenericTag<SupabaseClient>("SupabaseClient");

// Service tag for SupabaseRepository
export const SupabaseRepositoryService = Context.GenericTag<DbRepository>("SupabaseRepository");

// Functional implementation of SupabaseRepository
const makeSupabaseRepository = (client: SupabaseClient): DbRepository => ({
  findProfileById: (
    request: GetProfileByIdRequest,
  ): Effect.Effect<GetProfileByIdResponse, ApiError> =>
    Effect.gen(function* () {
      logger.info("Fetching profile", { id: request.userId });

      const result = yield* Effect.tryPromise({
        try: () => client.from("profiles").select("*").eq("id", request.userId).single(),
        catch: (error) =>
          ApiErrors.network(
            error instanceof Error ? error.message : "Unknown error occurred",
            error,
          ),
      });

      const { data, error } = result as { data: ProfileModel | null; error: unknown | null };

      if (error) {
        return yield* Effect.fail(
          ApiErrors.database(error instanceof Error ? error.message : "Database error", error),
        );
      }

      if (!data) {
        return yield* Effect.fail(
          ApiErrors.notFound(`Profile with id ${request.userId} not found`),
        );
      }

      return profileModelToDomain(data) as GetProfileByIdResponse;
    }),

  updateProfile: (request: UpdateProfileRequest): Effect.Effect<UpdateProfileResponse, ApiError> =>
    Effect.gen(function* () {
      // Authenticate user
      const { user } = yield* authenticateUser(client);

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
        const avatarUrl = yield* uploadAvatar(client, {
          file: request.avatar_file,
          userId: user.id,
        });
        updateData.avatar_url = avatarUrl;
      }

      // Update profile with new data
      const result = yield* Effect.tryPromise({
        try: () => client.from("profiles").update(updateData).eq("id", user.id).select().single(),
        catch: (error) =>
          ApiErrors.network(
            error instanceof Error ? error.message : "Unknown error occurred",
            error,
          ),
      });

      const { data, error } = result as { data: ProfileModel | null; error: unknown | null };

      if (error) {
        return yield* Effect.fail(
          ApiErrors.database(error instanceof Error ? error.message : "Database error", error),
        );
      }

      if (!data) {
        return yield* Effect.fail(ApiErrors.notFound(`Profile with id ${user.id} not found`));
      }

      const profile = profileModelToDomain(data);
      return {
        success: true,
        profile,
      } as UpdateProfileResponse;
    }),

  insertChatMessage: (
    request: InsertChatMessageRequest,
  ): Effect.Effect<InsertChatMessageResponse, ApiError> =>
    Effect.gen(function* () {
      logger.info("Inserting chat message", { request });

      const result = yield* Effect.tryPromise({
        try: () =>
          client
            .from("chat_history")
            .insert({
              tx_digest: request.txDigest,
              event_sequence: request.eventSequence.toString(),
              created_at: request.createdAt,
              sender_address: request.senderAddress,
              message_text: request.messageText,
            })
            .select()
            .single(),
        catch: (error) =>
          ApiErrors.network(
            error instanceof Error ? error.message : "Unknown error occurred",
            error,
          ),
      });

      const { data, error } = result as { data: ChatHistoryModel | null; error: unknown | null };

      if (error) {
        return yield* Effect.fail(
          ApiErrors.database(error instanceof Error ? error.message : "Database error", error),
        );
      }

      if (!data) {
        return yield* Effect.fail(
          ApiErrors.network("Failed to insert chat message, no data returned"),
        );
      }

      const chatMessage = chatHistoryModelToDomain(data);
      return {
        success: true,
        chatMessage,
      } as InsertChatMessageResponse;
    }),

  getLatestChatMessages: (
    request: GetLatestChatMessagesRequest,
  ): Effect.Effect<GetLatestChatMessagesResponse, ApiError> =>
    Effect.gen(function* () {
      logger.info("Fetching latest chat messages", { limit: request.limit });

      const result = yield* Effect.tryPromise({
        try: () =>
          client
            .from("chat_history")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(request.limit),
        catch: (error) =>
          ApiErrors.network(
            error instanceof Error ? error.message : "Unknown error occurred",
            error,
          ),
      });

      const { data, error } = result as {
        data: ChatHistoryModel[] | null;
        error: unknown | null;
      };

      if (error) {
        return yield* Effect.fail(
          ApiErrors.database(error instanceof Error ? error.message : "Database error", error),
        );
      }

      if (!data) {
        return []; // No messages found, return empty array
      }

      const chatMessages = data.map(chatHistoryModelToDomain);
      return chatMessages as GetLatestChatMessagesResponse;
    }),

  getPollCursor: (): Effect.Effect<GetPollCursorResponse, ApiError> =>
    Effect.gen(function* () {
      logger.info("Fetching poll cursor");

      const result = yield* Effect.tryPromise({
        try: () => client.from("poll_cursor").select("*").single(),
        catch: (error) =>
          ApiErrors.network(
            error instanceof Error ? error.message : "Unknown error occurred",
            error,
          ),
      });

      const { data, error } = result as { data: PollCursorModel | null; error: unknown | null };

      if (error) {
        // If no rows found, it might not be an error, depends on logic
        // For now, treating as an error if a cursor is expected to always exist
        if (error && typeof error === "object" && "code" in error && error.code === "PGRST116") {
          // PGRST116: Row not found
          return yield* Effect.fail(ApiErrors.notFound("Poll cursor not found"));
        }
        return yield* Effect.fail(
          ApiErrors.database(error instanceof Error ? error.message : "Database error", error),
        );
      }

      if (!data) {
        // This case might be redundant if PGRST116 is caught above
        return yield* Effect.fail(ApiErrors.notFound("Poll cursor not found"));
      }

      return pollCursorModelToDomain(data) as GetPollCursorResponse;
    }),

  updatePollCursor: (
    request: UpdatePollCursorRequest,
  ): Effect.Effect<UpdatePollCursorResponse, ApiError> =>
    Effect.gen(function* () {
      logger.info("Updating poll cursor", { cursor: request.cursor });

      // Assuming 'id' is the primary key and there is a unique row to update.
      // If the table can be empty, upsert might be better.
      // For this example, we assume a row with a known ID (e.g., a boolean or specific value) exists.
      // Let's assume the poll_cursor table has a single row with id = true (as in domain.ts)
      const result = yield* Effect.tryPromise({
        try: () =>
          client
            .from("poll_cursor")
            .update({
              cursor: request.cursor,
              updated_at: new Date().toISOString(),
            })
            .eq("id", true) // Condition to update the specific row
            .select()
            .single(),
        catch: (error) =>
          ApiErrors.network(
            error instanceof Error ? error.message : "Unknown error occurred",
            error,
          ),
      });

      const { data, error } = result as { data: PollCursorModel | null; error: unknown | null };

      if (error) {
        return yield* Effect.fail(
          ApiErrors.database(error instanceof Error ? error.message : "Database error", error),
        );
      }

      if (!data) {
        // This might happen if the row with id = true doesn't exist
        return yield* Effect.fail(ApiErrors.notFound("Poll cursor entry to update not found"));
      }

      const pollCursor = pollCursorModelToDomain(data);
      return {
        success: true,
        pollCursor,
      } as UpdatePollCursorResponse;
    }),
});

// Layer to provide SupabaseRepository service
export const SupabaseRepositoryLayer = Layer.effect(
  SupabaseRepositoryService,
  Effect.gen(function* () {
    const client = yield* SupabaseClientService;
    return makeSupabaseRepository(client);
  }),
);

// Factory function for direct usage (backwards compatibility)
export const createSupabaseRepository = (client: SupabaseClient): DbRepository =>
  makeSupabaseRepository(client);
