import { Context, Effect, Layer } from "effect";
import { z } from "zod";

/**
 * ✅ Supabase環境変数スキーマ（セキュリティ強化版）
 */
const supabaseEnvSchema = z
  .object({
    SUPABASE_URL: z
      .string()
      .refine(
        (url) => {
          const isProduction = process.env.NODE_ENV === "production";
          if (isProduction && (url.includes("localhost") || url.includes("127.0.0.1"))) {
            throw new Error("❌ SECURITY: Production environment cannot use localhost URLs");
          }
          return true;
        },
        { message: "Invalid SUPABASE_URL for production environment" },
      )
      .default("http://127.0.0.1:54321"),
    SUPABASE_ANON_KEY: z
      .string()
      .refine(
        (key) => {
          const isProduction = process.env.NODE_ENV === "production";
          if (isProduction && key.includes("supabase-demo")) {
            throw new Error("❌ SECURITY: Production environment cannot use demo keys");
          }
          if (isProduction && (!key || key.length < 100)) {
            throw new Error("❌ SECURITY: SUPABASE_ANON_KEY appears to be invalid or missing");
          }
          return true;
        },
        { message: "Invalid SUPABASE_ANON_KEY" },
      )
      .default(""),
    NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  })
  .refine(
    (data) => {
      // 全体的なセキュリティチェック
      if (data.NEXT_PUBLIC_SUPABASE_URL && process.env.NODE_ENV === "production") {
        if (!data.NEXT_PUBLIC_SUPABASE_URL.startsWith("https://")) {
          throw new Error("❌ SECURITY: Production NEXT_PUBLIC_SUPABASE_URL must use HTTPS");
        }
      }
      return true;
    },
    { message: "Supabase security validation failed" },
  );

/**
 * ✅ Supabase環境変数の型定義
 */
export type SupabaseEnv = z.infer<typeof supabaseEnvSchema>;

/**
 * ✅ Supabase設定の型定義
 */
export interface SupabaseConfig {
  readonly env: SupabaseEnv;
  readonly project: {
    readonly url: string;
    readonly anonKey: string;
  };
  readonly publicProject: {
    readonly url: string | undefined;
    readonly anonKey: string | undefined;
  };
}

/**
 * ✅ Supabase config service interface
 */
interface SupabaseConfigService {
  readonly config: SupabaseConfig;
}

/**
 * ✅ Factory function for SupabaseConfigService
 */
const createSupabaseConfigService = (config: SupabaseConfig): SupabaseConfigService => ({
  config,
});

/**
 * ✅ Context for Supabase config service
 */
export const SupabaseConfigContext = Context.GenericTag<SupabaseConfigService>(
  "@supabase/SupabaseConfigService",
);

/**
 * ✅ Effect-based Supabase config loading using unified pattern
 */
export const loadSupabaseConfigEffect = Effect.gen(function* () {
  // Parse and validate environment variables
  const env = yield* Effect.try({
    try: () => supabaseEnvSchema.parse(process.env),
    catch: (error) => {
      if (error instanceof Error) {
        return { _tag: "ValidationError" as const, message: error.message, cause: error };
      }
      return {
        _tag: "ValidationError" as const,
        message: "Unknown validation error",
        cause: error,
      };
    },
  });

  const config: SupabaseConfig = {
    env,
    project: {
      url: env.SUPABASE_URL,
      anonKey: env.SUPABASE_ANON_KEY,
    },
    publicProject: {
      url: env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  };

  return createSupabaseConfigService(config);
});

/**
 * ✅ Supabase config layer for dependency injection
 */
export const SupabaseConfigLayer = Layer.effect(SupabaseConfigContext, loadSupabaseConfigEffect);

/**
 * ✅ Legacy synchronous config loading for backwards compatibility
 */
export const loadSupabaseConfig = (): SupabaseConfig => {
  const { validateEnvSync } = require("@workspace/utils/validation");
  const env = validateEnvSync(supabaseEnvSchema, process.env);

  return {
    env,
    project: {
      url: env.SUPABASE_URL,
      anonKey: env.SUPABASE_ANON_KEY,
    },
    publicProject: {
      url: env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  };
};

/**
 * ✅ Helper Effects for accessing Supabase config
 */
export const getSupabaseConfig = Effect.gen(function* () {
  const service = yield* SupabaseConfigContext;
  return service.config;
});

export const getSupabaseProject = Effect.gen(function* () {
  const config = yield* getSupabaseConfig;
  return config.project;
});

export const getSupabasePublicProject = Effect.gen(function* () {
  const config = yield* getSupabaseConfig;
  return config.publicProject;
});
