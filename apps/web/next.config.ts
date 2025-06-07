import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import type { NextConfig } from "next";

// TypeScriptでasyncなTop-level awaitを使うための関数
const defineConfig = async (): Promise<NextConfig> => {
  const config: NextConfig = {
    /* config options here */
    output: "standalone",
    // Transpile workspace packages
    transpilePackages: [
      "@workspace/api",
      "@workspace/logger",
      "@workspace/sui",
      "@workspace/types",
    ],
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    // Fix for Clerk.js vendor chunk issues in Next.js 15
    experimental: {
      optimizePackageImports: ["@clerk/nextjs"],
    },
    // Webpack configuration to handle vendor chunks
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          crypto: false,
        };
      }
      return config;
    },
  };

  if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
  }

  return config;
};

export default defineConfig();
