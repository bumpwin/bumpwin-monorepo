import dotenv from "dotenv";
import { z } from "zod";

// 環境変数のスキーマ定義
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("3000"),
  POLLING_INTERVAL_MS: z.string().transform(Number).default("5000"),
  INSERT_INTERVAL_MS: z.string().transform(Number).default("1000"),
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
});

// 環境変数の型定義
export type Env = z.infer<typeof envSchema>;

// 設定の型定義
export interface Config {
  env: Env;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

// 設定の読み込み
export function loadConfig(): Config {
  dotenv.config();

  const env = envSchema.parse(process.env);

  return {
    env,
    isDevelopment: env.NODE_ENV === "development",
    isProduction: env.NODE_ENV === "production",
    isTest: env.NODE_ENV === "test",
  };
}

// シングルトンインスタンス
export const config = loadConfig();
