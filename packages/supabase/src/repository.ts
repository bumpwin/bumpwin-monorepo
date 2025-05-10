import type { Result } from "neverthrow";
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
  findProfileById(
    request: GetProfileByIdRequest,
  ): Promise<Result<GetProfileByIdResponse, ApiError>>;
  updateProfile(
    request: UpdateProfileRequest,
  ): Promise<Result<UpdateProfileResponse, ApiError>>;

  // Chat operations
  insertChatMessage(
    request: InsertChatMessageRequest,
  ): Promise<Result<InsertChatMessageResponse, ApiError>>;
  getLatestChatMessages(
    request: GetLatestChatMessagesRequest,
  ): Promise<Result<GetLatestChatMessagesResponse, ApiError>>;

  // Cursor operations
  getPollCursor(): Promise<Result<GetPollCursorResponse, ApiError>>;
  updatePollCursor(
    request: UpdatePollCursorRequest,
  ): Promise<Result<UpdatePollCursorResponse, ApiError>>;
}
