"use client";

import type { AppType } from "@workspace/api";
import { hc } from "hono/client";

const baseUrl =
  typeof window !== "undefined"
    ? `${window.location.origin}/api`
    : "http://localhost:3000/api";

export const api = hc<AppType>(baseUrl);
