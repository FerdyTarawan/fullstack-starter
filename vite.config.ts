import { defineConfig } from "vite-plus";

// Shared lint and format settings for every workspace package.
// App-specific Vite, Vitest, and framework configuration stays in each app.
export default defineConfig({
  fmt: {
    ignorePatterns: [
      "apps/web/openapi.json",
      "apps/web/src/client/**",
      "apps/web/src/routeTree.gen.ts",
    ],
    sortImports: true,
    overrides: [
      {
        files: ["apps/web/**"],
        options: {
          // Tailwind v4: sort against the app stylesheet so custom theme tokens are recognized.
          sortTailwindcss: {
            stylesheet: "apps/web/src/styles.css",
            functions: ["cn", "cva"],
          },
        },
      },
    ],
  },
  lint: {
    ignorePatterns: ["apps/web/src/client/**", "apps/web/src/routeTree.gen.ts"],
    plugins: ["typescript", "unicorn", "oxc", "import"],
    categories: { correctness: "error" },
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        files: ["apps/web/**"],
        plugins: ["react", "jsx-a11y", "vitest"],
        rules: {
          "react/react-in-jsx-scope": "off",
        },
      },
    ],
  },
});
