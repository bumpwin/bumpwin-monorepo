// ✅ Services barrel export
export {
  SupabaseService,
  SupabaseServiceLayer,
  insertChatMessage,
  fetchRecentChats,
  type SupabaseError,
} from "./supabase";

// ✅ Re-export types that are referenced in other modules
export type { ChatData, ChatResult } from "./supabase";
