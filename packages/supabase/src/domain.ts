import type { ChatHistoryModel, PollCursorModel, ProfileModel } from "./models";

export type ProfileId = string;

export interface Profile {
  id: ProfileId;
  displayName: string | null;
  avatarUrl: string | null;
}

export function profileModelToDomain(model: ProfileModel): Profile {
  return {
    id: model.id,
    displayName: model.display_name,
    avatarUrl: model.avatar_url,
  };
}

// ChatHistory domain type and converter
export interface ChatHistory {
  txDigest: string;
  eventSequence: bigint;
  createdAt: string;
  senderAddress: string;
  messageText: string;
}

export function chatHistoryModelToDomain(model: ChatHistoryModel): ChatHistory {
  return {
    txDigest: model.tx_digest,
    eventSequence: model.event_sequence,
    createdAt: model.created_at,
    senderAddress: model.sender_address,
    messageText: model.message_text,
  };
}

// PollCursor domain type and converter
export interface PollCursor {
  id: boolean;
  cursor: string | null;
  updatedAt: string;
}

export function pollCursorModelToDomain(model: PollCursorModel): PollCursor {
  return {
    id: model.id,
    cursor: model.cursor,
    updatedAt: model.updated_at,
  };
}
