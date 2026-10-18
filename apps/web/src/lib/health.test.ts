import { describe, expect, it, vi } from "vite-plus/test";

import { fetchHealth } from "./health";

describe("backend health", () => {
  it("accepts a healthy API and uses a bounded uncached request", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ status: "ok" }));
    expect(await fetchHealth("http://localhost:8000", request)).toEqual({ status: "ok" });
    expect(request).toHaveBeenCalledTimes(1);
    const passedRequest = request.mock.calls[0]?.[0] as Request;
    expect(passedRequest).toBeInstanceOf(Request);
    expect(passedRequest.url).toBe("http://localhost:8000/api/health");
    expect(passedRequest.method).toBe("GET");
    expect(passedRequest.signal).toBeInstanceOf(AbortSignal);
  });

  it.each([
    new Response(null, { status: 503 }),
    Response.json({ status: "unexpected" }),
    new Response("not JSON"),
  ])("handles an unhealthy or invalid response", async (response) => {
    expect(
      await fetchHealth("http://localhost:8000", vi.fn<typeof fetch>().mockResolvedValue(response)),
    ).toEqual({ status: "unavailable" });
  });

  it("recovers on a subsequent request", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new Error("Connection refused"))
      .mockResolvedValueOnce(Response.json({ status: "ok" }));
    expect(await fetchHealth("http://localhost:8000", request)).toEqual({ status: "unavailable" });
    expect(await fetchHealth("http://localhost:8000", request)).toEqual({ status: "ok" });
  });

  it("handles a timeout", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new DOMException("Timed out", "TimeoutError"));
    expect(await fetchHealth("http://localhost:8000", request)).toEqual({ status: "unavailable" });
  });
});
