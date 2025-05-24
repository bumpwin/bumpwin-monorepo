import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  LISTEN_CHAT_EVENT_POLLING_INTERVAL_MS: z.string().transform(Number),
  INSERT_CHAT_INTERVAL_MS: z.string().transform(Number),
  POLLING_INTERVAL_MS: z.string().transform(Number).default("200"),
});

let config: z.infer<typeof envSchema>;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Environment variables validation failed:");
    for (const err of error.errors) {
      console.error(`- ${err.path.join(".")}: ${err.message}`);
    }
  } else {
    console.error(
      "Unexpected error during environment variables validation:",
      error,
    );
  }
  process.exit(1);
}

export const loadListenChatEventPollingIntervalMs = () =>
  config.LISTEN_CHAT_EVENT_POLLING_INTERVAL_MS;
export const loadInsertChatIntervalMs = () => config.INSERT_CHAT_INTERVAL_MS;
export const loadPollingConfig = () => ({
  POLLING_INTERVAL_MS: config.POLLING_INTERVAL_MS,
  MESSAGES_PER_MINUTE: 30, // 2秒に1メッセージ
  ADDRESS_LENGTH: 64,
  DEFAULT_MESSAGE: "デフォルトメッセージ",
});
