export type HealthResult = { status: "ok" } | { status: "unavailable" };

export async function fetchHealth(
  baseUrl: string,
  request: typeof fetch = fetch,
): Promise<HealthResult> {
  try {
    const response = await request(new URL("/api/health", baseUrl), {
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
    if (!response.ok) return { status: "unavailable" };
    const body: unknown = await response.json();
    return typeof body === "object" && body !== null && "status" in body && body.status === "ok"
      ? { status: "ok" }
      : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}
