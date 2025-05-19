import { Hono } from "hono";
import { handle } from "hono/vercel";
import { app as mockpriceApp } from "./mockprice";
import { app as chatApp } from "./chat";

// basePath は API ルートのベースパスを指定します
const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});

export const mockpriceRoute = app.route("/mockprice", mockpriceApp);
export const chatRoute = app.route("/chat", chatApp);

export type AppType = typeof app;

// Export Edge Runtime configuration
export const config = {
  runtime: "edge",
};

// Export handler
export const GET = handle(app);
export const POST = handle(app);
