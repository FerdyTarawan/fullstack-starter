# Fullstack Template

A full-stack starter pairing a Python **FastAPI** backend with a **TanStack Start** (React + TypeScript) frontend.

## Stack

- **Backend (`apps/api`)**: FastAPI, Granian (ASGI server), Pydantic Settings, UV, Ruff, ty, pytest
- **Frontend (`apps/web`)**: TanStack Start, React 19, Tailwind CSS v4, shadcn (`aria-lyra` with React Aria), Vite+ (`vp`), React Testing Library (`happy-dom`)
- **Tooling**: Mise for runtime & task management, pnpm workspaces, `prek` for Git hooks

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

Press `Ctrl-C` to stop both servers together.

## Tasks

All everyday workflows run through Mise from the repo root:

| Command                             | Description                                                     |
| ----------------------------------- | --------------------------------------------------------------- |
| `mise run setup`                    | Install locked Python/Node dependencies and Git hooks           |
| `mise run dev`                      | Start both the API and frontend dev servers with reload         |
| `mise run dev:api`                  | Start only the FastAPI server                                   |
| `mise run dev:web`                  | Start only the frontend dev server                              |
| `mise run gen:api`                  | Generate TypeScript SDK (`src/client`) with `@hey-api/openapi-ts` |
| `mise run check`                    | Run linters, format checks, and type-checking (`ty` + `tsc`)    |
| `mise run format`                   | Auto-fix lint issues and format code across both apps           |
| `mise run test`                     | Run backend (`pytest`) and frontend (`vp test`) suites          |
| `mise run build`                    | Build the frontend client bundle and SSR server                 |
| `mise exec -- prek run --all-files` | Run pre-commit hooks across the entire repository               |

> **Note:** Git hooks only check staged files and won't modify your working tree. Run `mise run format` to apply formatting fixes automatically.

## Project Structure

```text
.
├── apps/
│   ├── api/        # FastAPI app (src/api), pytest suite, and UV config
│   └── web/        # TanStack Start app, routes, generated SDK (src/client), and UI
├── scripts/        # Dev server supervisor, OpenAPI schema exporter, and hook helper
├── mise.toml       # Pinned tool versions and project tasks
└── package.json    # Root pnpm workspace config
```

The starter includes a minimal `/api/health` endpoint and an example health-check call in `apps/web/src/lib/`, alongside a generated [Hey API (`@hey-api/openapi-ts`)](https://heyapi.dev/) SDK in `apps/web/src/client`. When you add or update FastAPI endpoints or Pydantic models, run `mise run gen:api` to regenerate the TypeScript SDK and types.

To customize local settings:
- **Backend**: Copy `apps/api/.env.example` to `apps/api/.env` to configure `CORS_ORIGINS`, `API_TITLE`, or `ENV`.
- **Frontend**: Copy `apps/web/.env.example` to `apps/web/.env` to override `API_BASE_URL` (defaults to `http://127.0.0.1:8000`).

### Adding UI Components

The frontend is configured with shadcn (`aria-lyra` style, React Aria components, neutral palette, and JetBrains Mono). To add new components:

```sh
mise exec -- pnpm --dir apps/web exec shadcn add input
```

## VS Code Setup

Open the repository root in VS Code. The workspace settings in `.vscode/` are pre-configured to:

- Format and fix **Python** on save using **Ruff**, with type checking powered by **ty** (pointing at `apps/api/.venv`, with Pylance disabled).
- Format and lint **TypeScript, React, JSON, CSS, HTML, Markdown, and YAML** on save using **Oxc** via the local `.vscode/*.mjs` wrappers.

If you already had VS Code open before running `mise run setup`, run **Developer: Reload Window** from the command palette so the language servers pick up the local environments.

## Production Build & Preview

To test a production build locally, build the SSR frontend and start the preview server:

```sh
mise run build
mise exec -- pnpm --dir apps/web exec vp preview --host 127.0.0.1 --port 3000
```

In a second terminal, run the FastAPI server without reload:

```sh
mise exec -- uv run --project apps/api --no-dev granian --interface asgi --host 127.0.0.1 --port 8000 api.main:app
```

When deploying to production, configure a TanStack Start deployment adapter for your target platform, serve static assets from `apps/web/dist/client`, run the SSR entry at `apps/web/dist/server/server.js`, and set `API_BASE_URL` in the frontend server's environment.
