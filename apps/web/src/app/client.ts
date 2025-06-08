"use client";

import type { AppType } from "@workspace/api";
import { hc } from "hono/client";

// Environment-safe API URL resolution
const getApiBaseUrl = (): string => {
  // Client-side: use current origin
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }

  // Server-side: use environment variable or fallback
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    return apiUrl;
  }

  // Development fallback only
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api";
  }

  // Production must have NEXT_PUBLIC_API_URL set
  throw new Error(
    "❌ SECURITY: NEXT_PUBLIC_API_URL must be set for server-side API calls in production",
  );
};

const baseUrl = getApiBaseUrl();
export const api = hc<AppType>(baseUrl);
