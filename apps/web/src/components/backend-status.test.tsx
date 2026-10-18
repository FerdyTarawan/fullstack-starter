import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { BackendStatus, StatusMessage } from "./backend-status";

afterEach(() => {
  cleanup();
});

describe("connection status", () => {
  it.each([
    ["loading", "Checking backend connection"],
    ["ok", "Backend connected"],
    ["unavailable", "Backend unavailable"],
  ] as const)("announces the %s state", (status, message) => {
    render(<StatusMessage status={status} />);
    const statusRegion = screen.getByRole("status");
    expect(statusRegion.textContent).toContain(message);
    expect(statusRegion.getAttribute("aria-live")).toBe("polite");
  });

  it("checks the backend on mount and retries when requested", async () => {
    const check = vi
      .fn<() => Promise<{ status: "ok" } | { status: "unavailable" }>>()
      .mockResolvedValueOnce({ status: "unavailable" })
      .mockResolvedValueOnce({ status: "ok" });

    render(<BackendStatus check={check} />);

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toContain("Backend unavailable");
    });

    fireEvent.click(screen.getByRole("button", { name: "Check again" }));

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toContain("Backend connected");
    });
    expect(check).toHaveBeenCalledTimes(2);
  });
});
