// Let the root workspace use the web app's Vite+ configuration and dependencies.
import { fileURLToPath } from "node:url";

process.chdir(fileURLToPath(new URL("../apps/web/", import.meta.url)));
process.argv.splice(2, 0, "lint");
await import("../apps/web/node_modules/vite-plus/bin/vp");
