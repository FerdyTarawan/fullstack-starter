import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { HealthResult } from "@/lib/health";

type Status = HealthResult["status"] | "loading";

export function StatusMessage({ status }: { status: Status }) {
  return (
    <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
      {status === "loading"
        ? "Checking backend connection…"
        : status === "ok"
          ? "Backend connected. All systems ready."
          : "Backend unavailable. Start the API and try again."}
    </p>
  );
}

export function BackendStatus({ check }: { check: () => Promise<HealthResult> }) {
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    void check().then(
      (result) => {
        if (active) setStatus(result.status);
      },
      () => {
        if (active) setStatus("unavailable");
      },
    );
    return () => {
      active = false;
    };
  }, [check, attempt]);

  return (
    <section aria-labelledby="connection-heading" className="space-y-6 border bg-card p-6">
      <div className="space-y-3">
        <h2 id="connection-heading" className="text-lg font-medium">
          API connection
        </h2>
        <StatusMessage status={status} />
      </div>
      <Button
        variant="outline"
        isDisabled={status === "loading"}
        onPress={() => {
          setStatus("loading");
          setAttempt((value) => value + 1);
        }}
      >
        {status === "loading" ? "Checking…" : "Check again"}
      </Button>
    </section>
  );
}
