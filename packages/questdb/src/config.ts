import { Context, Effect, Layer } from "effect";
import { z } from "zod";

/**
 * ✅ QuestDB環境変数スキーマ
 */
const questdbEnvSchema = z.object({
  QDB_HOST: z.string().default("localhost"),
  QDB_PG_PORT: z.string().transform(Number).default("8812"),
  QDB_USER: z.string().default("admin"),
  QDB_PASSWORD: z.string().default("questdb"),
});

/**
 * ✅ QuestDB環境変数の型定義
 */
export type QuestDbEnv = z.infer<typeof questdbEnvSchema>;

/**
 * ✅ QuestDB設定の型定義
 */
export interface QuestDbConfig {
  readonly env: QuestDbEnv;
  readonly connection: {
    readonly host: string;
    readonly port: number;
    readonly user: string;
    readonly password: string;
  };
}

/**
 * ✅ QuestDB config service interface
 */
interface QuestDbConfigService {
  readonly config: QuestDbConfig;
}

/**
 * ✅ Factory function for QuestDbConfigService
 */
const createQuestDbConfigService = (config: QuestDbConfig): QuestDbConfigService => ({
  config,
});

/**
 * ✅ Context for QuestDB config service
 */
export const QuestDbConfigContext = Context.GenericTag<QuestDbConfigService>(
  "@questdb/QuestDbConfigService",
);

/**
 * ✅ Effect-based QuestDB config loading using unified pattern
 */
export const loadQuestDbConfigEffect = Effect.gen(function* () {
  // Parse and validate environment variables
  const env = yield* Effect.try({
    try: () => questdbEnvSchema.parse(process.env),
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

  const config: QuestDbConfig = {
    env,
    connection: {
      host: env.QDB_HOST,
      port: env.QDB_PG_PORT,
      user: env.QDB_USER,
      password: env.QDB_PASSWORD,
    },
  };

  return createQuestDbConfigService(config);
});

/**
 * ✅ QuestDB config layer for dependency injection
 */
export const QuestDbConfigLayer = Layer.effect(QuestDbConfigContext, loadQuestDbConfigEffect);

/**
 * ✅ Legacy synchronous config loading for backwards compatibility
 */
export const loadQuestDbConfig = (): QuestDbConfig => {
  const { validateEnvSync } = require("@workspace/utils/validation");
  const env = validateEnvSync(questdbEnvSchema, process.env);

  return {
    env,
    connection: {
      host: env.QDB_HOST,
      port: env.QDB_PG_PORT,
      user: env.QDB_USER,
      password: env.QDB_PASSWORD,
    },
  };
};

/**
 * ✅ Helper Effects for accessing QuestDB config
 */
export const getQuestDbConfig = Effect.gen(function* () {
  const service = yield* QuestDbConfigContext;
  return service.config;
});

export const getQuestDbConnection = Effect.gen(function* () {
  const config = yield* getQuestDbConfig;
  return config.connection;
});
