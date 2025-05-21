import { randomUUID } from "node:crypto";
import process from "node:process";
import { logger } from "@workspace/logger";
import { SupabaseRepository } from "@workspace/supabase";
import { supabase } from "@workspace/supabase";
import type { InsertChatMessageRequest } from "@workspace/supabase";

const dbRepository = new SupabaseRepository(supabase);
const POLLING_INTERVAL_MS = 200;

const MESSAGES = [
  "TO THE MOON! 🚀",
  "DIAMOND HANDS 💎",
  "HODL STRONG! 💪",
  "WEN LAMBO? 🏎️",
  "FOMO IN NOW! 📈",
  "BULLISH AF! 🐂",
  "PAPER HANDS OUT! 📄",
  "WAGMI! 🌙",
  "NGMI! 📉",
  "APE IN! 🦍",
  "FUD = BAD! 🚫",
  "PUMP IT! 📈",
  "BAG HOLDER? 💼",
  "MOON SOON! 🌕",
  "WEN MOON? 🌙",
];

function getRandomMessage(): string {
  const index = Math.floor(Math.random() * MESSAGES.length);
  return MESSAGES[index] ?? "デフォルトメッセージ";
}

function getRandomAddress(): string {
  const hex = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
  return `0x${hex}`;
}

// Generate a random hex color
function generateRandomColor() {
  const hex = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
  return `0x${hex}`;
}

/**
 * Save chat message to Supabase
 */
async function insertChatMessage(
  message: InsertChatMessageRequest,
): Promise<void> {
  try {
    const insertResult = await dbRepository.insertChatMessage(message);
    if (insertResult.isOk()) {
      logger.info(`Message from ${message.senderAddress} saved to Supabase.`);
    } else {
      logger.error("Failed to save message:", insertResult.error);
    }
  } catch (error) {
    logger.error("Error saving message:", error);
  }
}

/**
 * Start polling for chat message insertion
 */
export async function startChatMessageInsertion() {
  try {
    logger.info("🚀 Starting chat message insertion polling...");
    logger.info(`Interval: ${POLLING_INTERVAL_MS}ms`);

    // Start the polling interval
    const intervalId = setInterval(async () => {
      try {
        // TODO: Implement message queue or event source here
        // For now, this is a placeholder for the actual message insertion logic
        const message: InsertChatMessageRequest = {
          txDigest: randomUUID(),
          eventSequence: BigInt(0),
          createdAt: new Date().toISOString(),
          senderAddress: getRandomAddress(),
          messageText: getRandomMessage(),
        };

        await insertChatMessage(message);
      } catch (error) {
        logger.error("Error in polling loop:", error);
      }
    }, POLLING_INTERVAL_MS);

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      clearInterval(intervalId);
      logger.info("Shutting down chat message insertion polling...");
      process.exit(0);
    });

    // Keep the process running
    process.stdin.resume();
  } catch (error) {
    logger.error("Fatal error starting chat message insertion polling:", error);
    process.exit(1);
  }
}

// Run the main function if this file is executed directly
if (require.main === module) {
  startChatMessageInsertion().catch((error) => {
    logger.error("Failed to start chat message insertion polling:", error);
    process.exit(1);
  });
}
