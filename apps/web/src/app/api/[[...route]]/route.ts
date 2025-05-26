import { app as chatApp } from "@/app/api/[[...route]]/chat";
import { app as mockpriceApp } from "@/app/api/[[...route]]/mockprice";
import { createApp } from "@workspace/api";
import { handle } from "hono/vercel";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const app = createApp({
  basePath: "/api",
  corsOrigin: process.env.NEXT_PUBLIC_URL || "*",
  enableDocs: true,
  additionalApis: [
    { path: "/chat", api: chatApp },
    { path: "/mockprice", api: mockpriceApp },
  ],
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
