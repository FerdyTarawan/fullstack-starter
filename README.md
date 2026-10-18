# Fullstack Template

A full-stack monorepo starter pairing a Python **FastAPI** backend with a **TanStack Start** (React + TypeScript) frontend.

## Stack

- **Backend (`apps/api`)**: FastAPI, Granian (ASGI server), Pydantic Settings, Scalar + Swagger UI, UV, Ruff, ty, pytest
- **Frontend (`apps/web`)**: TanStack Start, React 19 + React Compiler (`oxc-transform-react`), Tailwind CSS v4, shadcn (`aria-lyra` with React Aria), Vite+ (`vp`), Hey API (`@hey-api/openapi-ts`), React Testing Library (`happy-dom`)
- **Tooling**: Mise for runtime & task management, UV workspaces (Python), pnpm workspaces (Node/TS), `prek` for Git hooks

## Getting Started

Make sure you have [Mise](https://mise.jdx.dev/) installed and Git initialized (`git init`) before running setup so hooks can be installed. All required runtimes and CLI tools (Python, Node, UV, pnpm, Ruff, and `prek`) are pinned in `mise.toml`.

```sh
mise trust
mise install
mise run setup
mise run dev
```

- **Frontend**: <http://127.0.0.1:3000>
- **Backend API**: <http://127.0.0.1:8000> (Scalar docs at <http://127.0.0.1:8000/docs>, Swagger UI at <http://127.0.0.1:8000/swagger>)

Press `Ctrl-C` to stop all running dev servers together.

## Tasks

All everyday workflows run through Mise from the repo root:

| Command                             | Description                                                       |
| ----------------------------------- | ----------------------------------------------------------------- |
| `mise run setup`                    | Install locked Python/Node workspace dependencies and Git hooks   |
| `mise run dev`                      | Start all `dev:*` servers with reload                             |
| `mise run dev:api`                  | Start only the FastAPI server                                     |
| `mise run dev:web`                  | Start only the frontend dev server                                |
| `mise run gen:api`                  | Generate TypeScript SDK (`src/client`) with `@hey-api/openapi-ts` |
| `mise run check`                    | Run linters, format checks, and type-checking (`ty` + `tsc`)      |
| `mise run format`                   | Auto-fix lint issues and format code across the workspace         |
| `mise run test`                     | Run backend (`pytest`) and frontend (`vp test`) suites            |
| `mise run build`                    | Build the frontend client bundle and SSR server                   |
| `mise exec -- prek run --all-files` | Run pre-commit hooks across the entire repository                 |

> **Note:** Git hooks only check staged files and won't modify your working tree. Run `mise run format` to apply formatting fixes automatically.

## Project Structure

```text
.
├── apps/
│   ├── api/                 # FastAPI app (src/api) and pytest suite
│   └── web/                 # TanStack Start app, routes, generated SDK (src/client), and UI
├── scripts/                 # Dev server supervisor, OpenAPI schema exporter, and hook helper
├── mise.toml                # Pinned tool versions and project tasks
├── package.json             # Root pnpm workspace config
└── pyproject.toml           # Root UV workspace config
```

Both **UV** (`pyproject.toml` + `uv.lock`) and **pnpm** (`pnpm-workspace.yaml` + `pnpm-lock.yaml`) are configured as root workspaces with explicit member lists (`apps/api` in `pyproject.toml`, `apps/web` in `pnpm-workspace.yaml`). When you add another Python service or frontend app under `apps/`, simply add its path to the corresponding workspace file.

The starter includes a minimal `/api/health` endpoint and an example health-check call in `apps/web/src/lib/`, alongside a generated [Hey API (`@hey-api/openapi-ts`)](https://heyapi.dev/) SDK in `apps/web/src/client`. When you add or update FastAPI endpoints or Pydantic models, run `mise run gen:api` to regenerate the TypeScript SDK and types.

To customize local settings:
- **Backend**: Copy `apps/api/.env.example` to `apps/api/.env` to configure `CORS_ORIGINS`, `API_TITLE`, or `ENV`. Setting `ENV=production` disables the Scalar (`/docs`), Swagger (`/swagger`), and ReDoc (`/redoc`) UIs and the `/openapi.json` endpoint; `mise run gen:api` still works because it reads the schema in-process.
- **Frontend**: Copy `apps/web/.env.example` to `apps/web/.env` to override `API_BASE_URL` (defaults to `http://127.0.0.1:8000`).

### Adding UI Components

The frontend is configured with shadcn (`aria-lyra` style, React Aria components, neutral palette, and JetBrains Mono). To add new components:

```sh
mise exec -- pnpm --dir apps/web exec shadcn add input
```

## Continuous Integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes to `main` and on pull requests. It installs the tools pinned in `mise.toml`, then runs `mise run check`, `mise run test`, and `mise run build`. Finally it regenerates the API client and fails if `apps/web/src/client` or `routeTree.gen.ts` differ from what's committed, so remember to run `mise run gen:api` after backend changes.

## VS Code Setup

Open the repository root in VS Code. The workspace settings in `.vscode/` are pre-configured to:

- Format and fix **Python** on save using **Ruff**, with type checking powered by **ty** (pointing at the root `.venv`, with Pylance disabled).
- Format and lint **TypeScript, React, JSON, CSS, HTML, Markdown, and YAML** on save using **Oxc** via the local `.vscode/*.mjs` wrappers, including Oxlint's **React Compiler** correctness rules (`plugins: ["react"]`, `categories: { correctness: "error" }`).
- Sort **Tailwind classes** on format (in `class`/`className` and inside `cn(...)`/`cva(...)`), resolved against `apps/web/src/styles.css` so custom theme tokens are ordered correctly. Configure it under `fmt.sortTailwindcss` in `apps/web/vite.config.ts`.

If you already had VS Code open before running `mise run setup`, run **Developer: Reload Window** from the command palette so the language servers pick up the local environments.

## Production Build & Preview

To test a production build locally, build the SSR frontend and start the preview server:

```sh
mise run build
mise exec -- pnpm --dir apps/web exec vp preview --host 127.0.0.1 --port 3000
```

In a second terminal, run the FastAPI server without reload:

```sh
mise exec -- uv run --package api --no-dev granian --interface asgi --host 127.0.0.1 --port 8000 api.main:app
```

When deploying to production, configure a TanStack Start deployment adapter for your target platform, serve static assets from `apps/web/dist/client`, run the SSR entry at `apps/web/dist/server/server.js`, and set `API_BASE_URL` in the frontend server's environment.
