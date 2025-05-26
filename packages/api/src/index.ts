import { Hono } from "hono";
import { battleroundsApi } from "./battlerounds";
import { championsApi } from "./champions";
import { chatApi } from "./chat";
import { mockpriceApi } from "./mockprice";

export const createApp = () => {
  const app = new Hono()
    .route("/battlerounds", battleroundsApi)
    .route("/champions", championsApi)
    .route("/chat", chatApi)
    .route("/mockprice", mockpriceApi)
    .get("/health", (c) => {
      return c.json({ status: "ok" });
    });

  return app;
};

// Re-export individual APIs for direct use if needed
export { battleroundsApi } from "./battlerounds";
export { championsApi } from "./champions";
export { chatApi } from "./chat";
export { mockpriceApi } from "./mockprice";
