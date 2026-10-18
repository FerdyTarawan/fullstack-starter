# Fullstack Template

A full-stack starter pairing a Python **FastAPI** backend with a **TanStack Start** (React + TypeScript) frontend.

## Stack

- **Backend (`apps/api`)**: FastAPI, Granian (ASGI server), UV, Ruff, pytest
- **Frontend (`apps/web`)**: TanStack Start, React 19, Tailwind CSS v4, shadcn (`aria-lyra` with React Aria), Vite+ (`vp`)
- **Tooling**: Mise for runtime & task management, pnpm workspaces, `prek` for Git hooks

## Getting Started

Make sure you have [Mise](https://mise.jdx.dev/), [Ruff](https://docs.astral.sh/ruff/), and [prek](https://github.com/j178/prek) installed on your machine. Make sure Git is initialized (`git init`) before running setup so hooks can be installed.

```sh
mise trust
mise install
mise run setup
mise run dev
```

- **Frontend**: <http://127.0.0.1:3000>
- **Backend API**: <http://127.0.0.1:8000> (interactive docs at <http://127.0.0.1:8000/docs>)

Press `Ctrl-C` to stop both servers together.

## Tasks

All everyday workflows run through Mise from the repo root:

| Command                             | Description                                              |
| ----------------------------------- | -------------------------------------------------------- |
| `mise run setup`                    | Install locked Python/Node dependencies and Git hooks    |
| `mise run dev`                      | Start both the API and frontend dev servers with reload  |
| `mise run dev:api`                  | Start only the FastAPI server                            |
| `mise run dev:web`                  | Start only the frontend dev server                       |
| `mise run check`                    | Run linters, format checks, and TypeScript type-checking |
| `mise run format`                   | Auto-fix lint issues and format code across both apps    |
| `mise run test`                     | Run backend (`pytest`) and frontend (`vp test`) suites   |
| `mise run build`                    | Build the frontend client bundle and SSR server          |
| `mise exec -- prek run --all-files` | Run pre-commit hooks across the entire repository        |

> **Note:** Git hooks only check staged files and won't modify your working tree. Run `mise run format` to apply formatting fixes automatically.

## Project Structure

```text
.
├── apps/
│   ├── api/        # FastAPI app (src/api), pytest suite, and UV config
│   └── web/        # TanStack Start app, routes, and UI components
├── scripts/        # Dev server process runner and pre-commit hook helper
├── mise.toml       # Pinned tool versions (Python, Node, UV, pnpm) and tasks
└── package.json    # Root pnpm workspace config
```

The starter includes a minimal `/api/health` endpoint and an example health-check call in `apps/web/src/lib/`, which you can replace or expand using whichever pattern fits your project (TanStack Start server functions, a generated OpenAPI client, or direct client fetches). To override the default backend URL (`http://127.0.0.1:8000`), copy `apps/web/.env.example` to `apps/web/.env` and set `API_BASE_URL`.

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
