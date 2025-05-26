import { Hono } from "hono";
import { cors } from "hono/cors";
import { battleroundsApi } from "./battlerounds";
import { championsApi } from "./champions";
import { chatApi } from "./chat";
import { mockpriceApi } from "./mockprice";

interface CreateAppOptions {
  basePath?: string;
  corsOrigin?: string;
  enableDocs?: boolean;
  additionalApis?: Array<{ path: string; api: Hono }>;
}

export const createApp = (options: CreateAppOptions = {}) => {
  const app = options.basePath
    ? new Hono().basePath(options.basePath)
    : new Hono();

  // Setup CORS
  if (options.corsOrigin) {
    app.use(
      "*",
      cors({
        origin: options.corsOrigin,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
      }),
    );
  }

  // Mount additional APIs first (like chat, mockprice)
  if (options.additionalApis) {
    for (const { path, api } of options.additionalApis) {
      app.route(path, api);
    }
  }

  // Mount API routes
  app.route("/battlerounds", battleroundsApi);
  app.route("/champions", championsApi);
  app.route("/chat", chatApi);
  app.route("/mockprice", mockpriceApi);

  // Add health check
  app.get("/health", (c) => {
    return c.json({ status: "ok" });
  });

  // Add docs endpoint if enabled
  if (options.enableDocs) {
    app.get("/docs", (c) => {
      return c.json({
        endpoints: {
          battlerounds: {
            "/battlerounds": "Get all rounds",
            "/battlerounds/current": "Get current battle round with meme data",
            "/battlerounds/completed": "Get completed rounds",
            "/battlerounds/upcoming": "Get upcoming rounds",
            "/battlerounds/:id": "Get specific round by ID",
          },
          champions: {
            "/champions": "Get all champions",
          },
          chat: {
            "/chat": "Get latest chat messages",
          },
          mockprice: {
            "/mockprice": "Get mock price data",
          },
        },
      });
    });
  }

  return app;
};

// Re-export individual APIs for direct use if needed
export { battleroundsApi } from "./battlerounds";
export { championsApi } from "./champions";
export { chatApi } from "./chat";
export { mockpriceApi } from "./mockprice";
