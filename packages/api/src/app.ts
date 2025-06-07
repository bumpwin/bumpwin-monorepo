import { Hono } from "hono";
import { battleroundsApi } from "./battlerounds";
import { championsApi } from "./champions";
import { chatApi } from "./chat";
import { mockdataApi } from "./mockdata";
import { mockpriceApi } from "./mockprice";

// Create the complete API app with proper type inference
const app = new Hono()
  .route("/battlerounds", battleroundsApi)
  .route("/champions", championsApi)
  .route("/chat", chatApi)
  .route("/mockprice", mockpriceApi)
  .route("/mockdata", mockdataApi)
  .get("/health", (c) => {
    return c.json({ status: "ok" });
  });

// Ensure proper type inference
type App = typeof app;
export type AppType = App;
export default app;
