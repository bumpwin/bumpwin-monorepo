import { type AppError, AppErrors } from "@/lib/errors";
import { createClient } from "@supabase/supabase-js";
import { Effect } from "effect";

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

// ✅ Effect-based Supabase client creation with proper error handling
export const createSupabaseClientEffect = Effect.gen(function* () {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    yield* Effect.fail(SupabaseErrors.missingConfig("NEXT_PUBLIC_SUPABASE_URL"));
  }

  if (!supabaseAnonKey) {
    yield* Effect.fail(SupabaseErrors.missingConfig("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
  }

  // Validate URL format
  if (supabaseUrl) {
    try {
      new URL(supabaseUrl);
    } catch {
      yield* Effect.fail(SupabaseErrors.invalidUrl(supabaseUrl));
    }
  }

  return createClient(supabaseUrl || "", supabaseAnonKey || "");
});

// ✅ Legacy synchronous client creation with proper error handling
const createLegacySupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not found. Client will be null.");
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
export const supabase = createLegacySupabaseClient();

// Effect-based client getter with AppError integration
export const getSupabaseClient = createSupabaseClientEffect.pipe(
  Effect.mapError((error): AppError => {
    if (error._tag === "SupabaseConfigError") {
      return AppErrors.validation(error.message, "supabase_config", error);
    }
    return AppErrors.network("Failed to create Supabase client", error);
  }),
);
