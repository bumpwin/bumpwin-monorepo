import { Context, Effect, Layer } from "effect";
import { z } from "zod";

/**
 * ✅ Web App環境変数スキーマ（Next.js向け）
 */
const webEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // Client-side environment variables (NEXT_PUBLIC_*)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .refine(
      (url) => {
        if (process.env.NODE_ENV === "production" && !url.startsWith("https://")) {
          return false;
        }
        return true;
      },
      { message: "Invalid NEXT_PUBLIC_SUPABASE_URL for production environment" },
    )
    .default("http://127.0.0.1:54321"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .refine(
      (key) => {
        const isProduction = process.env.NODE_ENV === "production";
        if (isProduction && (!key || key.length < 100)) {
          return false;
        }
        return true;
      },
      { message: "Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY" },
    )
    .default(""),
  // Optional server-side environment variables
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

/**
 * ✅ Web App環境変数の型定義
 */
export type WebEnv = z.infer<typeof webEnvSchema>;

/**
 * ✅ Web App設定の型定義
 */
export interface WebConfig {
  readonly env: WebEnv;
  readonly client: {
    readonly supabaseUrl: string;
    readonly supabaseAnonKey: string;
  };
  readonly server: {
    readonly supabaseServiceRoleKey: string | undefined;
  };
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly isTest: boolean;
}

/**
 * ✅ Web config service interface
 */
interface WebConfigService {
  readonly config: WebConfig;
}

/**
 * ✅ Factory function for WebConfigService
 */
const createWebConfigService = (config: WebConfig): WebConfigService => ({
  config,
});

/**
 * ✅ Context for Web config service
 */
export const WebConfigContext = Context.GenericTag<WebConfigService>("@web/WebConfigService");

/**
 * ✅ Effect-based Web config loading using unified pattern
 */
export const loadWebConfigEffect = Effect.gen(function* () {
  // Parse and validate environment variables
  const env = yield* Effect.try({
    try: () => webEnvSchema.parse(process.env),
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

  const config: WebConfig = {
    env,
    client: {
      supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    server: {
      supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
    isDevelopment: env.NODE_ENV === "development",
    isProduction: env.NODE_ENV === "production",
    isTest: env.NODE_ENV === "test",
  };

  return createWebConfigService(config);
});

/**
 * ✅ Web config layer for dependency injection
 */
export const WebConfigLayer = Layer.effect(WebConfigContext, loadWebConfigEffect);

/**
 * ✅ Helper Effects for accessing Web config
 */
export const getWebConfig = Effect.gen(function* () {
  const service = yield* WebConfigContext;
  return service.config;
});

export const getClientConfig = Effect.gen(function* () {
  const config = yield* getWebConfig;
  return config.client;
});

export const getServerConfig = Effect.gen(function* () {
  const config = yield* getWebConfig;
  return config.server;
});
