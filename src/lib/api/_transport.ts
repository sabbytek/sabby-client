import type { ApiEnvelope, ApiError } from "@/lib/api/types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type RequestApiOptions = {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  payload?: unknown;
};

function normalizeApiError(responseStatus: number, body: unknown): ApiError {
  const b = body as Record<string, unknown> | undefined;
  return {
    message: String(b?.message ?? "Request failed"),
    status: responseStatus,
    code: String(b?.code ?? "ERR_REQUEST_FAILED"),
    details: body,
  };
}

/**
 * Client-side request helper. Routes through /app/api/* (BFF proxy).
 * On 401, dispatches auth:unauthorized for central session handling.
 */
export async function requestApi<TPayload = unknown>(
  options: RequestApiOptions,
): Promise<ApiEnvelope<TPayload>> {
  let body: string | undefined;
  if (options.payload !== undefined) {
    body = JSON.stringify(options.payload);
  }

  const response = await fetch(options.url, {
    method: options.method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body,
  });

  let raw: unknown = {};
  try {
    raw = await response.json();
  } catch {
    raw = { status: false, message: "Invalid response format" };
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    throw normalizeApiError(response.status, raw);
  }

  return (raw as ApiEnvelope<TPayload>) || { payload: raw as TPayload };
}

/**
 * Mock request helper — returns fake data for testing UI without backend.
 * Respects the same envelope shape.
 */
export async function requestApiMock<TPayload = unknown>(
  options: RequestApiOptions,
  mockData: TPayload,
): Promise<ApiEnvelope<TPayload>> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));
  return { status: true, code: 200, payload: mockData };
}

/**
 * Smart wrapper: uses mock data in dev, real API in production.
 * Flip NEXT_PUBLIC_USE_MOCK env var to control.
 */
export async function request<TPayload = unknown>(
  options: RequestApiOptions & { mock?: TPayload },
): Promise<ApiEnvelope<TPayload>> {
  if (USE_MOCK && options.mock) {
    return requestApiMock(options, options.mock);
  }
  return requestApi<TPayload>(options);
}
