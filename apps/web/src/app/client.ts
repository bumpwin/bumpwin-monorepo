import type { InferResponseType } from "hono/client";
import { hc } from "hono/client";
import type { MockpriceRouteType, ChatRouteType } from "./api/[[...route]]/route";

const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

// Mockprice client
const mockpriceClient = hc<MockpriceRouteType>(baseUrl);
export const mockprice = mockpriceClient.api.mockprice.$get;
export type MockpriceResType = InferResponseType<typeof mockprice, 200>;
export type MockpriceErrType = InferResponseType<typeof mockprice, 400>;

// Chat client
const chatClient = hc<ChatRouteType>(baseUrl);
export const chat = chatClient.api.chat.$get;
export type ChatResType = InferResponseType<typeof chat, 200>;