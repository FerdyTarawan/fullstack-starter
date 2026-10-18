import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { StatusMessage } from "./backend-status";

describe("connection status", () => {
  it.each([
    ["loading", "Checking backend connection"],
    ["ok", "Backend connected"],
    ["unavailable", "Backend unavailable"],
  ] as const)("announces the %s state", (status, message) => {
    const html = renderToStaticMarkup(<StatusMessage status={status} />);
    expect(html).toContain(message);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });
});
