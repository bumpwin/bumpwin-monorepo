import type { InferResponseType } from "hono/client";
import { hc } from "hono/client";

const baseUrl =
  typeof window !== "undefined"
    ? `${window.location.origin}/api`
    : "http://localhost:3000/api";

// Create client without type for now
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = hc(baseUrl) as any;

// Mockprice client
export const mockprice = client.mockprice.$get as typeof client.mockprice.$get;
export type MockpriceResType = InferResponseType<typeof mockprice, 200>;
export type MockpriceErrType = InferResponseType<typeof mockprice, 400>;

// Chat client
export const chat = client.chat.$get as typeof client.chat.$get;
export type ChatResType = InferResponseType<typeof chat, 200>;
