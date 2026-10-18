import { defineConfig, lazyPlugins, loadEnv } from "vite-plus";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "API_");
  if (env.API_BASE_URL && !process.env.API_BASE_URL) {
    process.env.API_BASE_URL = env.API_BASE_URL;
  }
  return {
    fmt: {
      ignorePatterns: ["src/routeTree.gen.ts", "src/client/**", "openapi.json"],
      // Tailwind v4: sort against our entry stylesheet so custom theme tokens are recognized.
      sortTailwindcss: { stylesheet: "./src/styles.css", functions: ["cn", "cva"] },
    },
    lint: {
      ignorePatterns: ["src/routeTree.gen.ts", "src/client/**"],
      jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
      rules: { "vite-plus/prefer-vite-plus-imports": "error" },
      options: { typeAware: true, typeCheck: true },
    },
    resolve: { tsconfigPaths: true },
    plugins: lazyPlugins(() => [
      tailwindcss(),
      ...(process.env.VITEST ? [] : [tanstackStart()]),
      viteReact(),
    ]),
    test: { environment: "happy-dom", include: ["src/**/*.test.{ts,tsx}"] },
  };
});
