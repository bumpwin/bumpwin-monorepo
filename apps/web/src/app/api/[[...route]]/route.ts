import { app } from "@workspace/api";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Create a wrapper app that mounts the API at /api
const apiApp = new Hono().route("/api", app);

// Export handlers
export const GET = handle(apiApp);
export const POST = handle(apiApp);
export const PUT = handle(apiApp);
export const DELETE = handle(apiApp);
export const PATCH = handle(apiApp);
export const OPTIONS = handle(apiApp);
