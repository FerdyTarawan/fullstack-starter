import { health, type HealthResponse } from "@/client";

export type HealthResult = Required<HealthResponse> | { status: "unavailable" };

export async function fetchHealth(
  baseUrl: string,
  request: typeof fetch = fetch,
): Promise<HealthResult> {
  try {
    const { data } = await health({
      baseUrl,
      fetch: request,
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
    return data?.status === "ok" ? { status: "ok" } : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}
