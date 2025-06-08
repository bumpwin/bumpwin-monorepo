// ✅ Effect-ts Direct Service Pattern
// Repository Pattern廃止 - Context/Layerで十分な抽象化を提供
// PRACTICES/effect.md準拠: 不要な抽象化層を除去

import { Context, type Effect } from "effect";
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

// ✅ Direct Service Pattern: Repository抽象化を除去
export interface SupabaseService {
  readonly findProfileById: (
    request: GetProfileByIdRequest,
  ) => Effect.Effect<GetProfileByIdResponse, ApiError>;
  readonly updateProfile: (
    request: UpdateProfileRequest,
  ) => Effect.Effect<UpdateProfileResponse, ApiError>;
  readonly insertChatMessage: (
    request: InsertChatMessageRequest,
  ) => Effect.Effect<InsertChatMessageResponse, ApiError>;
  readonly getLatestChatMessages: (
    request: GetLatestChatMessagesRequest,
  ) => Effect.Effect<GetLatestChatMessagesResponse, ApiError>;
  readonly getPollCursor: () => Effect.Effect<GetPollCursorResponse, ApiError>;
  readonly updatePollCursor: (
    request: UpdatePollCursorRequest,
  ) => Effect.Effect<UpdatePollCursorResponse, ApiError>;
}

// ✅ Context/Layer による依存注入
export const SupabaseService = Context.GenericTag<SupabaseService>("SupabaseService");
