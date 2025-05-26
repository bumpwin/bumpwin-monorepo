import { Hono } from "hono";

// Mock chat messages for development
const mockMessages = [
  {
    txDigest: "mock-1",
    eventSequence: "1",
    createdAt: new Date().toISOString(),
    senderAddress: "0x1234567890abcdef",
    messageText: "Hello, this is a test message!",
  },
  {
    txDigest: "mock-2",
    eventSequence: "2",
    createdAt: new Date().toISOString(),
    senderAddress: "0xabcdef1234567890",
    messageText: "Welcome to the chat!",
  },
];

export const chatApi = new Hono().get("/", async (c) => {
  const limit = Number(c.req.query("limit")) || 10;

  // Return mock messages
  return c.json(mockMessages.slice(0, limit));
});
