import { createApp } from "@workspace/api";
import { Hono } from "hono";
import { handle } from "hono/vercel";

// Use edge runtime as recommended by official documentation
export const runtime = "edge";

const app = new Hono().basePath("/api");

// Mount the API routes
const apiApp = createApp();
app.route("/", apiApp);

export type AppType = typeof apiApp;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
