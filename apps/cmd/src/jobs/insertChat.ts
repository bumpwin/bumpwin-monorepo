import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { config } from "@/config";
import { supabase } from "@/services/supabase";
import { logger } from "@/utils/logger";
import { SupabaseRepository } from "@workspace/supabase";
import type { InsertChatMessageRequest } from "@workspace/supabase";
import { type Result, err, ok } from "neverthrow";

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
const createMessageGenerator = (messages: Messages): MessageGenerator => ({
  generateMessage: () => {
    const index = Math.floor(Math.random() * messages.comments.length);
    return messages.comments[index] ?? "デフォルトメッセージ";
  },

  generateAddress: () => {
    const hex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("");
    return `0x${hex}`;
  },
});

// ポアソン分布に従って次のイベントまでの待機時間を計算
const getNextEventTime = (): number => {
  const meanWaitingTime = config.env.INSERT_CHAT_INTERVAL_MS; // 設定された間隔を使用
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

  logger.error("Failed to save message", {
    error: {
      message: insertResult.error.message,
      code: insertResult.error.code,
    },
  });
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
  const messagesResult = loadMessages();
  if (messagesResult.isErr()) {
    return err(messagesResult.error);
  }

  const messages = messagesResult.value;
  const messageGenerator = createMessageGenerator(messages);

  logger.info("🚀 Starting chat message insertion polling...");
  logger.info(`Message interval: ${config.env.INSERT_CHAT_INTERVAL_MS}ms`);
  logger.info(
    `Messages per minute: ${Math.floor(
      60000 / config.env.INSERT_CHAT_INTERVAL_MS,
    )} (${config.env.INSERT_CHAT_INTERVAL_MS}ms per message)`,
  );
  logger.info(`Total available messages: ${messages.comments.length}`);

  let nextEventTime = getNextEventTime();
  let lastCheckTime = Date.now();

  const intervalId = setInterval(async () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastCheckTime;

    if (elapsedTime >= nextEventTime) {
      const result = await generateAndSaveMessage(messageGenerator);
      if (result.isOk()) {
        nextEventTime = getNextEventTime();
        lastCheckTime = currentTime;
      }
    }
  }, config.env.INSERT_CHAT_INTERVAL_MS);

  // グレースフルシャットダウン
  process.on("SIGINT", () => {
    clearInterval(intervalId);
    logger.info("Shutting down chat message insertion polling...");
    process.exit(0);
  });

  process.stdin.resume();
  return ok(undefined);
};
