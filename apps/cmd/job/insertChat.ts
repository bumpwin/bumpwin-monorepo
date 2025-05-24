import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { logger } from "@workspace/logger";
import { SupabaseRepository } from "@workspace/supabase";
import type { InsertChatMessageRequest } from "@workspace/supabase";
import { type Result, err, ok } from "neverthrow";
import { loadPollingConfig } from "./config";
import { supabase } from "./supabaseClient";

// 型定義
type Messages = {
  comments: string[];
};

type ChatMessage = {
  txDigest: string;
  eventSequence: bigint;
  createdAt: string;
  senderAddress: string;
  messageText: string;
};

type MessageGenerator = {
  generateMessage: () => string;
  generateAddress: () => string;
};

type ErrorType = {
  code: string;
  message: string;
};

// エラー定数
const ERRORS = {
  FILE_READ: {
    code: "FILE_READ_ERROR",
    message: "Failed to read messages file",
  },
  JSON_PARSE: {
    code: "JSON_PARSE_ERROR",
    message: "Failed to parse messages JSON",
  },
  DB_INSERT: {
    code: "DB_INSERT_ERROR",
    message: "Failed to insert message into database",
  },
} as const;

// メッセージの読み込み
const loadMessages = (): Result<Messages, ErrorType> => {
  try {
    const fileContent = readFileSync(join(__dirname, "messages.json"), "utf-8");
    const messages = JSON.parse(fileContent) as Messages;
    return ok(messages);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return err(ERRORS.JSON_PARSE);
    }
    return err(ERRORS.FILE_READ);
  }
};

// メッセージ生成器
const createMessageGenerator = (
  messages: Messages,
  config: ReturnType<typeof loadPollingConfig>,
): MessageGenerator => ({
  generateMessage: () => {
    const index = Math.floor(Math.random() * messages.comments.length);
    return messages.comments[index] ?? config.DEFAULT_MESSAGE;
  },

  generateAddress: () => {
    const hex = Array.from({ length: config.ADDRESS_LENGTH }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("");
    return `0x${hex}`;
  },
});

// ポアソン分布に従って次のイベントまでの待機時間を計算
const getNextEventTime = (config: ReturnType<typeof loadPollingConfig>): number => {
  const meanWaitingTime = (60 * 1000) / config.MESSAGES_PER_MINUTE;
  return -meanWaitingTime * Math.log(Math.random());
};

// データベース操作
const dbRepository = new SupabaseRepository(supabase);

const insertChatMessage = async (
  message: ChatMessage,
): Promise<Result<void, ErrorType>> => {
  const insertResult = await dbRepository.insertChatMessage(message);

  if (insertResult.isOk()) {
    logger.info(`Message from ${message.senderAddress} saved to Supabase.`);
    return ok(undefined);
  }

  logger.error("Failed to save message:", insertResult.error);
  return err(ERRORS.DB_INSERT);
};

// メッセージ生成と保存
const generateAndSaveMessage = async (
  messageGenerator: MessageGenerator,
): Promise<Result<void, ErrorType>> => {
  const message: ChatMessage = {
    txDigest: randomUUID(),
    eventSequence: BigInt(0),
    createdAt: new Date().toISOString(),
    senderAddress: messageGenerator.generateAddress(),
    messageText: messageGenerator.generateMessage(),
  };

  return insertChatMessage(message);
};

// メイン処理
export const startChatMessageInsertion = async (): Promise<
  Result<void, ErrorType>
> => {
  const config = loadPollingConfig();
  const messagesResult = loadMessages();
  if (messagesResult.isErr()) {
    return err(messagesResult.error);
  }

  const messages = messagesResult.value;
  const messageGenerator = createMessageGenerator(messages, config);

  logger.info("🚀 Starting chat message insertion polling...");
  logger.info(`Interval: ${config.POLLING_INTERVAL_MS}ms`);
  logger.info(`Average messages per minute: ${config.MESSAGES_PER_MINUTE}`);
  logger.info(`Total available messages: ${messages.comments.length}`);

  let nextEventTime = getNextEventTime(config);
  let lastCheckTime = Date.now();

  const intervalId = setInterval(async () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastCheckTime;

    if (elapsedTime >= nextEventTime) {
      const result = await generateAndSaveMessage(messageGenerator);
      if (result.isOk()) {
        nextEventTime = getNextEventTime(config);
        lastCheckTime = currentTime;
      }
    }
  }, config.POLLING_INTERVAL_MS);

  // グレースフルシャットダウン
  process.on("SIGINT", () => {
    clearInterval(intervalId);
    logger.info("Shutting down chat message insertion polling...");
    process.exit(0);
  });

  process.stdin.resume();
  return ok(undefined);
};

// 直接実行時のエントリーポイント
if (require.main === module) {
  startChatMessageInsertion().then((result) => {
    if (result.isErr()) {
      logger.error(
        "Failed to start chat message insertion polling:",
        result.error,
      );
      process.exit(1);
    }
  });
}
