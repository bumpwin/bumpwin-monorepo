import { Hono } from "hono";
import { cors } from "hono/cors";
import { battlesApi } from "./battles";
import { championsApi } from "./champions";
import { roundsApi } from "./rounds";

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
    options.additionalApis.forEach(({ path, api }) => {
      app.route(path, api);
    });
  }

  // Mount API routes
  app.route("/battles", battlesApi);
  app.route("/champions", championsApi);
  app.route("/rounds", roundsApi);

  // Add health check
  app.get("/health", (c) => {
    return c.json({ status: "ok" });
  });

  // Add docs endpoint if enabled
  if (options.enableDocs) {
    app.get("/docs", (c) => {
      return c.json({
        endpoints: {
          battles: {
            "/battles/current": "Get current battle round with meme data",
            "/battles/rounds": "Get all rounds",
            "/battles/rounds/:id": "Get specific round by ID",
          },
          champions: {
            "/champions": "Get all champions",
          },
          rounds: {
            "/rounds": "Get all rounds",
            "/rounds/completed": "Get completed rounds",
            "/rounds/upcoming": "Get upcoming rounds",
          },
        },
      });
    });
  }

  return app;
};

// Re-export individual APIs for direct use if needed
export { battlesApi } from "./battles";
export { championsApi } from "./champions";
export { roundsApi } from "./rounds";
