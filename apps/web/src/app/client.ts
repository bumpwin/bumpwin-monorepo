import type { AppType } from "@/app/api/[[...route]]/route";
import type { InferResponseType } from "hono/client";
import { hc } from "hono/client";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

// API client
export const client = hc<AppType>(`${baseUrl}/api`);

// Mockprice client
export const mockprice = client.mockprice.$get;
export type MockpriceResType = InferResponseType<typeof mockprice, 200>;
export type MockpriceErrType = InferResponseType<typeof mockprice, 400>;

// Chat client
export const chat = client.chat.$get;
export type ChatResType = InferResponseType<typeof chat, 200>;

// Battlerounds client
export const battlerounds = client.battlerounds;
export const getCurrentBattleRound = client.battlerounds.current.$get;
export type BattleRoundResType = InferResponseType<
  typeof getCurrentBattleRound,
  200
>;

// Champions client
export const champions = client.champions;
export const getChampions = client.champions.$get;
export type ChampionsResType = InferResponseType<typeof getChampions, 200>;
