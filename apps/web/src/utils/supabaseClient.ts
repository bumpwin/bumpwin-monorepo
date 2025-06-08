import { type AppError, AppErrors } from "@/lib/errors";
import { createClient } from "@supabase/supabase-js";
import { Context, Effect } from "effect";

// ✅ Config Context定義
interface ConfigService {
  readonly config: {
    readonly env: {
      readonly NEXT_PUBLIC_SUPABASE_URL: string;
      readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    };
  };
}

const ConfigContext = Context.GenericTag<ConfigService>("ConfigService");

// ✅ Supabase configuration errors
const SupabaseErrors = {
  missingConfig: (variable: string) => ({
    _tag: "SupabaseConfigError" as const,
    message: `Missing required environment variable: ${variable}`,
    variable,
  }),

  invalidUrl: (url: string) => ({
    _tag: "SupabaseConfigError" as const,
    message: `Invalid Supabase URL: ${url}`,
    url,
  }),
} as const;

// type SupabaseError = ReturnType<(typeof SupabaseErrors)[keyof typeof SupabaseErrors]>;

// ✅ Effect-based Supabase client creation with Config Context
export const createSupabaseClientEffect = Effect.gen(function* (_) {
  const config = yield* _(ConfigContext);

  const supabaseUrl = config.config.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = config.config.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    yield* _(Effect.fail(SupabaseErrors.missingConfig("NEXT_PUBLIC_SUPABASE_URL")));
  }

  if (!supabaseAnonKey) {
    yield* _(Effect.fail(SupabaseErrors.missingConfig("NEXT_PUBLIC_SUPABASE_ANON_KEY")));
  }

  // ✅ URL検証もEffect.try使用
  yield* _(
    Effect.try({
      try: () => new URL(supabaseUrl),
      catch: () => SupabaseErrors.invalidUrl(supabaseUrl),
    }),
  );

  return createClient(supabaseUrl, supabaseAnonKey);
});

// ✅ Config Context経由のレガシークライアント作成 (後方互換性)
const createLegacySupabaseClientFromEnv = () => {
  // ✅ 環境変数直接アクセスは非推奨 - Config Context使用を推奨
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[DEPRECATED] Direct env access. Use createSupabaseClientEffect with ConfigContext instead.",
    );
    return null;
  }

  try {
    new URL(supabaseUrl);
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Invalid Supabase URL:", supabaseUrl, error);
    return null;
  }
};

// Legacy client export for backwards compatibility
// Note: Still used by realtime subscriptions in Chat components
// TODO: Migrate to Effect-based realtime subscriptions
export const supabase = createLegacySupabaseClientFromEnv();

// Effect-based client getter with AppError integration
export const getSupabaseClient = createSupabaseClientEffect.pipe(
  Effect.mapError((error): AppError => {
    if (error._tag === "SupabaseConfigError") {
      return AppErrors.validation(error.message, "supabase_config", error);
    }
    return AppErrors.network("Failed to create Supabase client", error);
  }),
);

// Export ConfigContext for use in other modules
export { ConfigContext };
