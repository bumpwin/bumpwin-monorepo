import { createApp } from "@workspace/api";

export async function GET() {
  const app = createApp({
    basePath: "/api",
  });

  // Get all routes
  const routes = app.routes.map((route) => ({
    method: route.method,
    path: route.path,
  }));

  return Response.json({
    message: "Debug info",
    routes,
    hasChampions: routes.some((r) => r.path.includes("champions")),
  });
}
