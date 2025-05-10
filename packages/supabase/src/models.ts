export interface ProfileModel {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatHistoryModel {
  tx_digest: string;
  event_sequence: bigint;
  created_at: string;
  sender_address: string;
  message_text: string;
}

export interface PollCursorModel {
  id: boolean;
  cursor: string | null;
  updated_at: string;
}
