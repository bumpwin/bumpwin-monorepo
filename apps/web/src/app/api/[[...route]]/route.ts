import { Hono } from "hono";
import { handle } from "hono/vercel";
import { app as mockpriceApp } from "./mockprice";
import { app as chatApp } from "./chat";

// Edge Runtime configuration
export const runtime = 'edge';

// basePath は API ルートのベースパスを指定します
const app = new Hono().basePath("/api");

// ルートの追加と変数の保持
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockpriceRoute = app.route("/mockprice", mockpriceApp);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const chatRoute = app.route("/chat", chatApp);

// 型定義用
export type AppType = typeof app;
export type MockpriceRouteType = typeof mockpriceRoute;
export type ChatRouteType = typeof chatRoute;

// Next.jsのルート関数のみをエクスポート
export const GET = handle(app);
export const POST = handle(app);
