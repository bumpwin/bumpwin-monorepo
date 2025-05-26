import { createApp } from "@workspace/api";
import type { AppType as BaseAppType } from "@workspace/api";
import { handle } from "hono/vercel";

// Edge Runtime configuration
export const runtime = "edge";

// Create API instance with basePath
const app = createApp().basePath("/api");

// Export the base app type for client usage
export type AppType = BaseAppType;

// Next.js route handlers
export const GET = handle(app);
export const POST = handle(app);
