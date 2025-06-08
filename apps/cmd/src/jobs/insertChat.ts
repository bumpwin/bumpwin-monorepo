import { randomUUID } from "node:crypto";
import { join } from "node:path";
import process from "node:process";
import { loadConfig } from "@/config";
import { supabase } from "@/services/supabase";
import { logger } from "@/utils/logger";
import { FileSystem } from "@effect/platform";
import { NodeFileSystem } from "@effect/platform-node";
import { createSupabaseRepository } from "@workspace/supabase";
import { Effect } from "effect";

// 型定義
interface Messages {
  readonly comments: readonly string[];
}

interface ChatMessage {
  readonly txDigest: string;
  readonly eventSequence: bigint;
  readonly createdAt: string;
  readonly senderAddress: string;
  readonly messageText: string;
}

interface MessageGenerator {
  readonly generateMessage: () => string;
  readonly generateAddress: () => string;
}

// Simple error type
type InsertChatError = {
  readonly _tag: "FileReadError" | "JsonParseError" | "DbInsertError";
  readonly cause: unknown;
};

// Error factory functions
const InsertChatErrors = {
  fileReadError: (cause: unknown): InsertChatError => ({ _tag: "FileReadError", cause }),
  jsonParseError: (cause: unknown): InsertChatError => ({ _tag: "JsonParseError", cause }),
  dbInsertError: (cause: unknown): InsertChatError => ({ _tag: "DbInsertError", cause }),
} as const;

// メッセージの読み込み (Effect version)
const loadMessages = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const filePath = join(__dirname, "messages.json");

  const fileContent = yield* fs
    .readFileString(filePath)
    .pipe(Effect.mapError((cause) => InsertChatErrors.fileReadError(cause)));

  const messages = yield* Effect.try(() => JSON.parse(fileContent) as Messages).pipe(
    Effect.mapError((cause) => InsertChatErrors.jsonParseError(cause)),
  );

  return messages;
});

// メッセージ生成器
const createMessageGenerator = (messages: Messages): MessageGenerator => ({
  generateMessage: () => {
    const index = Math.floor(Math.random() * messages.comments.length);
    return messages.comments[index] ?? "デフォルトメッセージ";
  },

  generateAddress: () => {
    const hex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(
      "",
    );
    return `0x${hex}`;
  },
});

// ポアソン分布に従って次のイベントまでの待機時間を計算
const getNextEventTime = (interval: number): number => {
  const meanWaitingTime = interval;
  return -meanWaitingTime * Math.log(Math.random());
};

// Simple database operations
const dbRepository = createSupabaseRepository(supabase);
const config = loadConfig();

const insertChatMessage = (message: ChatMessage) =>
  Effect.gen(function* () {
    yield* dbRepository.insertChatMessage(message).pipe(
      Effect.mapError((cause) => InsertChatErrors.dbInsertError(cause)),
      Effect.tap(() => Effect.log(`Message from ${message.senderAddress} saved to Supabase.`)),
    );
  });

// メイン処理 (Effect version)
export const startChatMessageInsertion = Effect.gen(function* () {
  const messages = yield* loadMessages.pipe(Effect.provide(NodeFileSystem.layer));

  const messageGenerator = createMessageGenerator(messages);

  yield* Effect.log("🚀 Starting chat message insertion polling...");
  yield* Effect.log(`Message interval: ${config.env.INSERT_CHAT_INTERVAL_MS}ms`);
  yield* Effect.log(
    `Messages per minute: ${Math.floor(
      60000 / config.env.INSERT_CHAT_INTERVAL_MS,
    )} (${config.env.INSERT_CHAT_INTERVAL_MS}ms per message)`,
  );
  yield* Effect.log(`Total available messages: ${messages.comments.length}`);

  let nextEventTime = getNextEventTime(config.env.INSERT_CHAT_INTERVAL_MS);
  let lastCheckTime = Date.now();

  const intervalId = setInterval(async () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastCheckTime;

    if (elapsedTime >= nextEventTime) {
      const message: ChatMessage = {
        txDigest: randomUUID(),
        eventSequence: BigInt(0),
        createdAt: new Date().toISOString(),
        senderAddress: messageGenerator.generateAddress(),
        messageText: messageGenerator.generateMessage(),
      };

      await Effect.runPromise(
        insertChatMessage(message).pipe(
          Effect.catchAll((error) => Effect.logError(`Failed to generate message: ${error._tag}`)),
        ),
      );

      nextEventTime = getNextEventTime(config.env.INSERT_CHAT_INTERVAL_MS);
      lastCheckTime = currentTime;
    }
  }, config.env.INSERT_CHAT_INTERVAL_MS);

  // グレースフルシャットダウン
  process.on("SIGINT", () => {
    clearInterval(intervalId);
    logger.info("Shutting down chat message insertion polling...");
    process.exit(0);
  });

  process.stdin.resume();
});
