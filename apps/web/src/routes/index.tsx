import { createFileRoute } from "@tanstack/react-router";

import { BackendStatus } from "@/components/backend-status";
import { getHealth } from "@/lib/health.functions";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-10 px-6 py-16">
      <header className="space-y-4">
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          Fullstack / Starter
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Ready to build.</h1>
        <p className="max-w-lg text-base text-muted-foreground">
          TanStack Start and FastAPI, connected. A minimal foundation for your next application.
        </p>
      </header>
      <BackendStatus check={getHealth} />
      <footer className="text-xs text-muted-foreground">
        React Aria · shadcn Lyra · Python + UV
      </footer>
    </main>
  );
}
