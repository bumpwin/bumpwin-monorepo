import { Hono } from "hono";
import { chatRoute } from "./routes/chat";
import { mockpriceRoute } from "./routes/mockprice";

export function createApp() {
  const app = new Hono();

  // Mount routes
  app.route("/chat", chatRoute);
  app.route("/mockprice", mockpriceRoute);

  return app;
}

export type AppType = ReturnType<typeof createApp>;
