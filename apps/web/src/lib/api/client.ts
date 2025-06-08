import type { AppType } from "@workspace/api";
import { hc } from "hono/client";

// Create type-safe Hono client with full type inference
export const apiClient = hc<AppType>("/api");

// Export types for hooks usage
export type ApiClientType = typeof apiClient;
