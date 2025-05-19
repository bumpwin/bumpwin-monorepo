import type { InferResponseType } from "hono/client";
import { hc } from "hono/client";
import type { mockpriceRoute, chatRoute } from "./api/[[...route]]/route";

const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

// Mockprice client
const mockpriceClient = hc<typeof mockpriceRoute>(baseUrl);
export const mockprice = mockpriceClient.api.mockprice.$get;
export type MockpriceResType = InferResponseType<typeof mockprice, 200>;
export type MockpriceErrType = InferResponseType<typeof mockprice, 400>;

// Chat client
const chatClient = hc<typeof chatRoute>(baseUrl);
export const chat = chatClient.api.chat.$get;
export type ChatResType = InferResponseType<typeof chat, 200>; 