import { randomUUID } from "node:crypto";
import { join } from "node:path";
import process from "node:process";
import { ConfigContext } from "@/config";
import { FileSystem } from "@effect/platform";
import { NodeFileSystem } from "@effect/platform-node";
import { SupabaseClientService, SupabaseService, SupabaseServiceLayer } from "@workspace/supabase";
import { createSupabaseClient } from "@workspace/supabase";
import type { InsertChatMessageRequest } from "@workspace/supabase";
import { Context, Effect, Layer } from "effect";

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

// ✅ Effect-ts Context/Layer依存注入パターン
const insertChatMessage = (message: ChatMessage) =>
  Effect.gen(function* (_) {
    const supabaseService = yield* _(SupabaseService);

    const request: InsertChatMessageRequest = {
      txDigest: message.txDigest,
      eventSequence: message.eventSequence,
      createdAt: message.createdAt,
      senderAddress: message.senderAddress,
      messageText: message.messageText,
    };

    return yield* _(supabaseService.insertChatMessage(request));
  });

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

// ✅ Logger Service Context/Layer化
interface LoggerService {
  readonly info: (message: string) => Effect.Effect<void>;
  readonly logError: (message: string) => Effect.Effect<void>;
}

const LoggerService = Context.GenericTag<LoggerService>("LoggerService");

const LoggerServiceLayer = Layer.succeed(LoggerService, {
  info: (message: string) => Effect.sync(() => console.log(`[INFO] ${message}`)),
  logError: (message: string) => Effect.sync(() => console.error(`[ERROR] ${message}`)),
});

// const insertChatMessage = (message: ChatMessage) =>
//   Effect.gen(function* () {
//     yield* dbRepository.insertChatMessage(message).pipe(
//       Effect.mapError((cause) => InsertChatErrors.dbInsertError(cause)),
//       Effect.tap(() => Effect.log(`Message from ${message.senderAddress} saved to Supabase.`)),
//     );
//   });

// メイン処理 (Effect version) - 完全なContext/Layer依存注入
export const startChatMessageInsertion = Effect.gen(function* (_) {
  const configService = yield* _(ConfigContext);
  const logger = yield* _(LoggerService);
  const config = configService.config;

  const messages = yield* _(loadMessages.pipe(Effect.provide(NodeFileSystem.layer)));
  const messageGenerator = createMessageGenerator(messages);

  yield* _(logger.info("🚀 Starting chat message insertion polling..."));
  yield* _(logger.info(`Message interval: ${config.env.INSERT_CHAT_INTERVAL_MS}ms`));
  yield* _(
    logger.info(
      `Messages per minute: ${Math.floor(
        60000 / config.env.INSERT_CHAT_INTERVAL_MS,
      )} (${config.env.INSERT_CHAT_INTERVAL_MS}ms per message)`,
    ),
  );
  yield* _(logger.info(`Total available messages: ${messages.comments.length}`));

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

      // Create layers with dependency injection
      const supabaseClient = createSupabaseClient(
        config.env.SUPABASE_URL,
        config.env.SUPABASE_ANON_KEY,
      );
      const clientLayer = Layer.succeed(SupabaseClientService, supabaseClient);
      const serviceLayer = SupabaseServiceLayer;
      const mainLayer = Layer.provide(serviceLayer, clientLayer);

      await Effect.runPromise(
        insertChatMessage(message).pipe(
          Effect.catchAll((error) =>
            Effect.gen(function* (_) {
              const errorLogger = yield* _(LoggerService);
              yield* _(errorLogger.logError(`Failed to generate message: ${error._tag}`));
            }),
          ),
          Effect.provide(Layer.merge(mainLayer, LoggerServiceLayer)),
        ),
      );

      nextEventTime = getNextEventTime(config.env.INSERT_CHAT_INTERVAL_MS);
      lastCheckTime = currentTime;
    }
  }, config.env.INSERT_CHAT_INTERVAL_MS);

  // グレースフルシャットダウン - Effect化
  const shutdownEffect = Effect.sync(() => {
    process.on("SIGINT", () => {
      clearInterval(intervalId);
      Effect.runSync(logger.info("Shutting down chat message insertion polling..."));
      process.exit(0);
    });
  });

  yield* _(shutdownEffect);
  yield* _(Effect.sync(() => process.stdin.resume()));
});
