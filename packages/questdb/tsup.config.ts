import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  target: "esnext",
  dts: true,
  clean: true,
});
