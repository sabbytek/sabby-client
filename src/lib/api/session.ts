import type { User } from "@/lib/api/auth.types";

const ACCESS_TOKEN_KEY = "sabyy_access_token";
const REFRESH_TOKEN_KEY = "sabyy_refresh_token";
const USER_KEY = "sabyy_user";
const TENANT_SLUG_KEY = "sabyy_tenant_slug";

// Non-sensitive marker cookie so the route proxy (server-side, no localStorage
// access) can tell a signed-in browser apart. Tokens never go into cookies.
export const SESSION_COOKIE = "sabyy_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // matches backend JWT_REFRESH_EXPIRY (7d)

// Cookies written by earlier builds, which stored the token and user in them.
const LEGACY_COOKIES = ["sabyy_access_token", "sabyy_user"];

export type Session = {
  accessToken: string;
  refreshToken: string;
  tenantSlug: string;
  user: User;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readJson<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getSession(): Session | null {
  if (!isBrowser()) return null;

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const tenantSlug = localStorage.getItem(TENANT_SLUG_KEY);
  const user = readJson<User>(USER_KEY);

  if (!accessToken || !refreshToken || !tenantSlug || !user) return null;
  return { accessToken, refreshToken, tenantSlug, user };
}

export function storeSession(session: Session): void {
  if (!isBrowser()) return;

  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  localStorage.setItem(TENANT_SLUG_KEY, session.tenantSlug);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));

  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
  clearLegacyCookies();
}

export function updateAccessToken(accessToken: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

/**
 * Clears tokens and user. The tenant slug is kept on purpose so the login
 * form can prefill the business handle next time.
 */
export function clearSession(): void {
  if (!isBrowser()) return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
  clearLegacyCookies();
}

export function getLastTenantSlug(): string {
  if (!isBrowser()) return "";
  return localStorage.getItem(TENANT_SLUG_KEY) ?? "";
}

function clearLegacyCookies(): void {
  for (const name of LEGACY_COOKIES) {
    document.cookie = `${name}=; path=/; max-age=0`;
  }
}
