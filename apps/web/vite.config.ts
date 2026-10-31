import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins, loadEnv } from "vite-plus";

// Shared lint and format settings live in the workspace root `vite.config.ts`.
// This file only contains app-specific Vite, Vitest, and framework configuration.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "API_");
  if (env.API_BASE_URL && !process.env.API_BASE_URL) {
    process.env.API_BASE_URL = env.API_BASE_URL;
  }
  return {
    resolve: { tsconfigPaths: true },
    plugins: lazyPlugins(() => [
      tailwindcss(),
      ...(process.env.VITEST ? [] : [tanstackStart()]),
      viteReact({ compiler: true }),
    ]),
    test: { environment: "happy-dom", include: ["src/**/*.test.{ts,tsx}"] },
  };
});
