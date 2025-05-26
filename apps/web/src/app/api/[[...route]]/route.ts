import { createApp } from "@workspace/api";
import { handle } from "hono/vercel";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const app = createApp({
  basePath: "/api",
  corsOrigin: process.env.NEXT_PUBLIC_URL || "*",
  enableDocs: true,
});

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
