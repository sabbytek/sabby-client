import { ApiError, type ApiEnvelope } from "@/lib/api/types";
import { clearSession, getSession, updateAccessToken } from "@/lib/api/session";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001").replace(/\/+$/, "");

type QueryValue = string | number | boolean | undefined | null;

type RequestOptions<TData> = {
  /** Backend path including version prefix, e.g. "/v1/orders". */
  path: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Attach the bearer token and handle 401 via refresh. Default true. */
  auth?: boolean;
  /** Returned instead of calling the backend when NEXT_PUBLIC_USE_MOCK=true. */
  mock?: TData;
};

export const isMockMode = USE_MOCK;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

function toApiError(status: number, body: unknown): ApiError {
  const b = body as Record<string, unknown> | undefined;

  // Standard backend failure envelope: { success: false, error: { code, message, details } }
  const err = b?.error;
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    return new ApiError(
      String(e.message ?? "Request failed"),
      status,
      String(e.code ?? "ERR_REQUEST_FAILED"),
      e.details,
    );
  }

  // Fastify's own responses (e.g. unknown route): { message, error, statusCode }
  return new ApiError(String(b?.message ?? "Request failed"), status, "ERR_REQUEST_FAILED", body);
}

async function send(
  url: string,
  method: string,
  body: unknown,
  accessToken: string | null,
): Promise<Response> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  try {
    return await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Can't reach the server. Check your connection and try again.",
      0,
      "NETWORK_ERROR",
    );
  }
}

async function parse<TData>(response: Response): Promise<TData> {
  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    throw new ApiError("Invalid response from server", response.status, "INVALID_RESPONSE");
  }

  if (!response.ok) throw toApiError(response.status, raw);

  const envelope = raw as ApiEnvelope<TData>;
  if (envelope?.success !== true) throw toApiError(response.status, raw);
  return envelope.data;
}

// Single in-flight refresh shared by all requests that hit a 401 at once.
let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const session = getSession();
  if (!session) return null;

  try {
    const response = await send(
      buildUrl("/v1/auth/refresh"),
      "POST",
      { tenantSlug: session.tenantSlug, refreshToken: session.refreshToken },
      null,
    );
    const data = await parse<{ accessToken: string }>(response);
    updateAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

function refreshOnce(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function endSession(): void {
  clearSession();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  }
}

/**
 * Calls the BPOS backend and returns the unwrapped `data` of the envelope.
 * Throws ApiError on failure. On 401 for authenticated calls, refreshes the
 * access token once and retries; if that fails, ends the session and
 * dispatches auth:unauthorized for central handling.
 */
export async function request<TData = unknown>(options: RequestOptions<TData>): Promise<TData> {
  if (USE_MOCK && options.mock !== undefined) {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 300));
    return options.mock;
  }

  const auth = options.auth ?? true;
  const url = buildUrl(options.path, options.query);
  const token = auth ? (getSession()?.accessToken ?? null) : null;

  let response = await send(url, options.method, options.body, token);

  if (response.status === 401 && auth) {
    const newToken = await refreshOnce();
    if (!newToken) {
      endSession();
      return parse<TData>(response);
    }
    response = await send(url, options.method, options.body, newToken);
    if (response.status === 401) endSession();
  }

  return parse<TData>(response);
}
