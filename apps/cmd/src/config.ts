import dotenv from "dotenv";
import { Context, Effect, Layer } from "effect";
import { z } from "zod";

/**
 * ✅ Config Error Factory - Implementation First Pattern
 */
const ConfigErrors = {
  validation: (errors: z.ZodError) => ({
    _tag: "ConfigValidationError" as const,
    message: "Configuration validation failed",
    errors: errors.errors,
    details: errors.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
  }),

  loading: (cause: unknown) => ({
    _tag: "ConfigLoadError" as const,
    message: "Failed to load configuration",
    cause,
  }),

  environment: (variable: string) => ({
    _tag: "ConfigEnvironmentError" as const,
    message: `Required environment variable missing: ${variable}`,
    variable,
  }),
} as const;

export type ConfigError = ReturnType<(typeof ConfigErrors)[keyof typeof ConfigErrors]>;

/**
 * ✅ Environment schema for CMD app - Strict validation
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("4000"),
  LISTEN_CHAT_EVENT_POLLING_INTERVAL_MS: z.string().transform(Number).default("5000"),
  INSERT_CHAT_INTERVAL_MS: z.string().transform(Number).default("2000"),
  // ✅ Required in production, fallback in development only
  SUPABASE_URL: z.string().min(1, "SUPABASE_URL is required"),
  SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY is required"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * ✅ Config Service Interface
 */
export interface ConfigService {
  readonly config: Config;
}

export interface Config {
  env: Env;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

/**
 * ✅ Config Context Tag
 */
export const ConfigContext = Context.GenericTag<ConfigService>("ConfigService");

/**
 * ✅ Config Layer Implementation - Effect-ts compliant
 */
export const ConfigLayer = Layer.effect(
  ConfigContext,
  Effect.gen(function* () {
    // Load .env file
    yield* Effect.sync(() => {
      dotenv.config();
    });

    // Get port from command line arguments if provided
    const portFromArgs = yield* Effect.sync(() => {
      const portIndex = process.argv.indexOf("--port");
      return portIndex !== -1 && process.argv[portIndex + 1]
        ? process.argv[portIndex + 1]
        : undefined;
    });

    // Override PORT if provided via command line
    if (portFromArgs) {
      yield* Effect.sync(() => {
        process.env.PORT = portFromArgs;
      });
    }

    // Parse and validate environment variables
    const env = yield* Effect.try({
      try: () => envSchema.parse(process.env),
      catch: (error) => {
        if (error instanceof z.ZodError) {
          return ConfigErrors.validation(error);
        }
        return ConfigErrors.loading(error);
      },
    });

    // Create config object
    const config: Config = {
      env,
      isDevelopment: env.NODE_ENV === "development",
      isProduction: env.NODE_ENV === "production",
      isTest: env.NODE_ENV === "test",
    };

    yield* Effect.log(`Configuration loaded for ${env.NODE_ENV} environment`);
    yield* Effect.log(`Server will run on port ${env.PORT}`);

    return { config };
  }),
);

/**
 * ✅ Helper Effects for accessing config
 */
export const getConfig = Effect.gen(function* () {
  const configService = yield* ConfigContext;
  return configService.config;
});

export const getEnv = Effect.gen(function* () {
  const config = yield* getConfig;
  return config.env;
});

export const isDevelopment = Effect.gen(function* () {
  const config = yield* getConfig;
  return config.isDevelopment;
});

export const isProduction = Effect.gen(function* () {
  const config = yield* getConfig;
  return config.isProduction;
});
