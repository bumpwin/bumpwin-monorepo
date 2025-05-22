import "dotenv/config";

export const insertChatIntervalMs = Number(process.env.INSERT_CHAT_INTERVAL_MS);

export const listenChatEventPollingIntervalMs = Number(
  process.env.LISTEN_CHAT_EVENT_POLLING_INTERVAL_MS,
);
