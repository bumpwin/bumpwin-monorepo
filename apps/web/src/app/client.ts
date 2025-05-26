import type { AppType } from "@/app/api/[[...route]]/route";
import type { InferResponseType } from "hono/client";
import { hc } from "hono/client";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

// API client
const client = hc<AppType>(baseUrl);

// Mockprice client
export const mockprice = client.api.mockprice.$get;
export type MockpriceResType = InferResponseType<typeof mockprice, 200>;
export type MockpriceErrType = InferResponseType<typeof mockprice, 400>;

// Chat client
export const chat = client.api.chat.$get;
export type ChatResType = InferResponseType<typeof chat, 200>;
