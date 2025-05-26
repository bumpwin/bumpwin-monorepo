import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import type { NextConfig } from "next";

// TypeScriptでasyncなTop-level awaitを使うための関数
const defineConfig = async (): Promise<NextConfig> => {
  const config: NextConfig = {
    /* config options here */
    output: "standalone",
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Temporarily ignore TS errors during build
      ignoreBuildErrors: true,
    },
  };

  if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
  }

  return config;
};

export default defineConfig();
