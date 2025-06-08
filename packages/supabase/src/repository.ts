import type { Effect } from "effect";
import type { ApiError } from "./error";
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

// Repository interface
export interface DbRepository {
  findProfileById(request: GetProfileByIdRequest): Effect.Effect<GetProfileByIdResponse, ApiError>;
  updateProfile(request: UpdateProfileRequest): Effect.Effect<UpdateProfileResponse, ApiError>;

  // Chat operations
  insertChatMessage(
    request: InsertChatMessageRequest,
  ): Effect.Effect<InsertChatMessageResponse, ApiError>;
  getLatestChatMessages(
    request: GetLatestChatMessagesRequest,
  ): Effect.Effect<GetLatestChatMessagesResponse, ApiError>;

  // Cursor operations
  getPollCursor(): Effect.Effect<GetPollCursorResponse, ApiError>;
  updatePollCursor(
    request: UpdatePollCursorRequest,
  ): Effect.Effect<UpdatePollCursorResponse, ApiError>;
}
