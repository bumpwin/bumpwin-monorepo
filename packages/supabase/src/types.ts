import type { ChatHistory, PollCursor, Profile } from "./domain";

// `GET /api/profile`
export interface GetProfileByIdRequest {
  userId: string;
}
export type GetProfileByIdResponse = Profile;

// `PUT /api/profile/update`
export interface UpdateProfileRequest {
  display_name?: string | null;
  avatar_file?: File | null;
}
export interface UpdateProfileResponse {
  success: boolean;
  profile: Profile;
}

// Insert a new chat message
export interface InsertChatMessageRequest extends ChatHistory {
}
export interface InsertChatMessageResponse {
  success: boolean;
  chatMessage: ChatHistory;
}

// Get latest N chat messages
export interface GetLatestChatMessagesRequest {
  limit: number;
}
export type GetLatestChatMessagesResponse = ChatHistory[];

// Get the current poll cursor
// No request payload needed
export type GetPollCursorResponse = PollCursor;

// Update the poll cursor
export interface UpdatePollCursorRequest {
  cursor: string | null;
}
export interface UpdatePollCursorResponse {
  success: boolean;
  pollCursor: PollCursor;
}
