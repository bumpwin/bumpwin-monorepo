import { type SupabaseClient, createClient } from "@supabase/supabase-js";
import { Context, Effect, Layer } from "effect";
import { ConfigContext } from "../config";

/**
 * ✅ Chat data type definition
 */
export interface ChatData {
  tx_digest: string;
  event_sequence: number;
  created_at: string;
  sender_address: string;
  message_text: string;
}

export interface ChatResult {
  id: string;
  tx_digest: string;
  event_sequence: number;
  created_at: string;
  sender_address: string;
  message_text: string;
}

/**
 * ✅ Supabase Service Interface - Context/Layer Pattern
 */
interface SupabaseService {
  readonly client: SupabaseClient;
  readonly insertChat: (chatData: ChatData) => Effect.Effect<ChatResult[], SupabaseError>;
  readonly selectChats: (limit?: number) => Effect.Effect<ChatResult[], SupabaseError>;
}

/**
 * ✅ Supabase Error Factory - Implementation First Pattern
 */
const SupabaseErrors = {
  connection: (cause: unknown) => ({
    _tag: "SupabaseConnectionError" as const,
    message: "Failed to connect to Supabase",
    cause,
  }),

  query: (operation: string, cause: unknown) => ({
    _tag: "SupabaseQueryError" as const,
    message: `Supabase ${operation} operation failed`,
    operation,
    cause,
  }),

  configuration: (message: string, cause?: unknown) => ({
    _tag: "SupabaseConfigurationError" as const,
    message: `Supabase configuration error: ${message}`,
    cause,
  }),

  authentication: (cause: unknown) => ({
    _tag: "SupabaseAuthenticationError" as const,
    message: "Supabase authentication failed",
    cause,
  }),
} as const;

export type SupabaseError = ReturnType<(typeof SupabaseErrors)[keyof typeof SupabaseErrors]>;

/**
 * ✅ Supabase Context Tag
 */
export const SupabaseService = Context.GenericTag<SupabaseService>("SupabaseService");

/**
 * ✅ Supabase Service Layer Implementation
 */
export const SupabaseServiceLayer = Layer.effect(
  SupabaseService,
  Effect.gen(function* () {
    // Get config from Context
    const config = yield* ConfigContext;

    // Validate configuration
    if (!config.config.env.SUPABASE_URL || !config.config.env.SUPABASE_ANON_KEY) {
      yield* Effect.fail(SupabaseErrors.configuration("Missing SUPABASE_URL or SUPABASE_ANON_KEY"));
    }

    // Create Supabase client
    const client = yield* Effect.try({
      try: () => createClient(config.config.env.SUPABASE_URL, config.config.env.SUPABASE_ANON_KEY),
      catch: (error) => SupabaseErrors.connection(error),
    });

    // Test connection
    yield* Effect.tryPromise({
      try: () => client.from("chats").select("*").limit(1),
      catch: (error) => SupabaseErrors.connection(error),
    });

    yield* Effect.log("Supabase service initialized successfully");

    return {
      client,

      insertChat: (chatData: ChatData) =>
        Effect.tryPromise({
          try: () =>
            client
              .from("chats")
              .insert(chatData)
              .select()
              .then(({ data, error }) => {
                if (error) return Promise.reject(error);
                return (data || []) as ChatResult[];
              }),
          catch: (error) => SupabaseErrors.query("insert", error),
        }),

      selectChats: (limit = 10) =>
        Effect.tryPromise({
          try: () =>
            client
              .from("chats")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(limit)
              .then(({ data, error }) => {
                if (error) throw error;
                return (data || []) as ChatResult[];
              }),
          catch: (error) => SupabaseErrors.query("select", error),
        }),
    };
  }),
);

/**
 * ✅ Helper Effects for common operations
 */
export const insertChatMessage = (chatData: ChatData) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseService;
    const result = yield* supabase.insertChat(chatData);
    yield* Effect.log(`Chat message inserted: ${JSON.stringify(result)}`);
    return result;
  });

export const fetchRecentChats = (limit = 10) =>
  Effect.gen(function* () {
    const supabase = yield* SupabaseService;
    const chats = yield* supabase.selectChats(limit);
    yield* Effect.log(`Fetched ${chats.length} recent chat messages`);
    return chats;
  });

/**
 * ✅ Legacy export for backwards compatibility
 * @deprecated Use Effect-based service instead
 */
export const createLegacySupabaseClient = () => {
  try {
    const { loadConfig } = require("../config");
    const config = loadConfig();
    return createClient(config.env.SUPABASE_URL, config.env.SUPABASE_ANON_KEY);
  } catch (error) {
    console.error("Failed to create legacy Supabase client:", error);
    return null;
  }
};

// ✅ Legacy export removed - use Context/Layer pattern instead
// export const supabase = createLegacySupabaseClient(); // ❌ Removed global export
