# Shorten It

A minimal full-stack starter: FastAPI served by Granian with UV, TanStack Start
with React and TypeScript, and shadcn **Lyra with React Aria**. Mise manages runtimes and tasks;
Ruff handles Python formatting/linting; Vite+ handles the frontend; prek installs
the Git hooks.

## Quick start

Use your existing Mise, UV, pnpm, Ruff **0.17.1**, and prek **0.5.5** installations.
No additional global CLI installation is required. Vite+ is pinned locally to
**1.1.0** and runs through pnpm, using the Node version supplied by Mise.

```sh
mise trust
mise install
mise run setup
mise run dev
```

`mise install` reuses the installed versions pinned in `mise.toml` (Python
3.14.7, Node 26.7.0, UV 0.12.24, pnpm 12.6.0). `setup` installs locked project
dependencies and the prek hook. Run commands from the repository root. In a new
checkout, Git must already be initialized before running `setup`.

Open <http://127.0.0.1:3000>. The API runs on <http://127.0.0.1:8000>, with
interactive API documentation at <http://127.0.0.1:8000/docs>. Ctrl-C stops both
services; if either service exits, the other is stopped too.

Granian serves the API using its ASGI interface. Its reload extra is included
only in the development dependency group and watches `apps/api/src`.

## Commands

| Command                             | Purpose                                        |
| ----------------------------------- | ---------------------------------------------- |
| `mise run setup`                    | Sync frozen dependencies and install Git hooks |
| `mise run dev`                      | Run both apps with reload                      |
| `mise run dev:api`                  | Run only the API                               |
| `mise run dev:web`                  | Run only the frontend                          |
| `mise run check`                    | Check formatting, lint, and frontend types     |
| `mise run format`                   | Apply Python lint fixes and format both apps   |
| `mise run test`                     | Run pytest and Vite+ tests                     |
| `mise run build`                    | Build frontend client assets and SSR server    |
| `mise exec -- prek run --all-files` | Run hooks against all tracked files            |

The hooks check relevant staged files without modifying them. Use `format` to
apply changes. Ruff and prek are external prerequisites, deliberately excluded
from the Python environment. No Husky or Vite+ hook dispatcher is installed.

## VS Code

Open the repository root as your VS Code folder. Root `.vscode/settings.json`
uses Ruff for Python and Oxc for JavaScript/TypeScript, with safe lint fixes and
formatting on save (including Auto Save). Oxc also formats JSON, CSS, HTML,
Markdown, and YAML on save. Issues without a safe automatic fix remain in the
Problems panel.

The installed ty extension provides Python language features and workspace type
diagnostics, using the API virtual environment. Pylance is disabled for this
workspace. ty uses the executable bundled with its extension, so no additional
CLI or project dependency is needed; Ruff continues to handle formatting and lint fixes.

The two `.vscode/*.mjs` launchers run the existing web-local Vite+ language
servers using `apps/web/vite.config.ts`; they need no additional packages.
Ruff uses your existing environment installation. The Python interpreter points
to the API virtual environment, and the generated route manifest remains read-only.
If the folder was already open, run **Developer: Reload Window** to pick up the
updated language-server launchers.

## Structure and API connection

- `apps/api`: Python package under `src/shorten_it_api`, tests, and its UV lockfile.
- `apps/web`: TanStack Start routes, generated Lyra components, and frontend tests.
- `scripts`: development process supervisor and staged-file hook adapter.
- Root Mise config and pnpm workspace/lockfile: shared tooling and commands.

`GET /api/health` responds with `{"status":"ok"}`. The homepage calls a TanStack
Start server function, which fetches the Python API with a three-second timeout.
The browser uses the Start server's RPC bridge; the API URL stays server-side and
no CORS configuration is needed. Failures show an unavailable state and a retry
button. The UI uses a live region and React Aria keyboard interactions.

The API URL defaults to `http://127.0.0.1:8000`. To override it during development,
copy `apps/web/.env.example` to `apps/web/.env`, edit `API_BASE_URL`, and restart
the frontend. An exported `API_BASE_URL` takes precedence. Keep this variable
server-only; do not add a `VITE_` prefix.

Lyra uses the generated neutral palette, JetBrains Mono font, and square
components. Add components from the frontend directory using its local CLI:

```sh
mise exec -- pnpm --dir apps/web exec shadcn add input
```

`components.json` keeps the `aria-lyra` registry style for future additions.
Use the `@/` alias for frontend imports. Route files regenerate
`src/routeTree.gen.ts` when the dev server or build runs.

## Built app and deployment

Build and preview the complete SSR app locally:

```sh
mise run build
mise exec -- pnpm --dir apps/web exec vp preview --host 127.0.0.1 --port 3000
```

Run the API without reload in a separate terminal:

```sh
mise exec -- uv run --project apps/api --no-dev granian --interface asgi --host 127.0.0.1 --port 8000 shorten_it_api.main:app
```

Vite preview is for local verification. Production hosting is deferred: choose a
TanStack Start deployment adapter for the target host, serve the generated
`apps/web/dist/client` assets, and run the SSR handler from
`apps/web/dist/server/server.js` with that adapter. Set `API_BASE_URL` in the
frontend server environment and keep FastAPI reachable from that server.

Database, authentication, URL-shortening features, containers, and hosted CI are
intentionally deferred. No application secrets are required for this starter.
