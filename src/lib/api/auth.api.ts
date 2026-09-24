import { request } from "@/lib/api/_transport";
import type { AuthResponse, LoginRequest, User } from "@/lib/api/auth.types";

// Mock user data for development
const MOCK_USER: User = {
  id: "user_123",
  email: "merchant@sabyy.app",
  name: "Femi Adeleke",
  merchant_id: "merchant_456",
  merchant_name: "Fashion Hub NG",
  role: "admin",
  permissions: ["orders:read", "orders:write", "inventory:read", "inventory:write", "customers:read", "finance:read"],
  avatar: undefined,
};

// Mock login API call
export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  const mockResponse: AuthResponse = {
    user: MOCK_USER,
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcl8xMjMiLCJtZXJjaGFudF9pZCI6Im1lcmNoYW50XzQ1NiIsImV4cCI6MTcyMzY4MTUwMH0.mock_token",
    refresh_token: "refresh_token_mock_123",
    expires_in: 3600,
  };

  // Call through mock transport layer
  const response = await request<AuthResponse>({
    url: "/api/v1/auth/login",
    method: "POST",
    payload,
    mock: mockResponse,
  });

  if (!response.payload) {
    throw new Error("Login failed: no response payload");
  }

  return response.payload;
}

// Mock logout API call
export async function logoutUser(refreshToken: string): Promise<void> {
  await request({
    url: "/api/v1/auth/logout",
    method: "POST",
    payload: { refresh_token: refreshToken },
    mock: { status: true, message: "Logged out successfully" },
  });
}

// Get current user from stored tokens (mock)
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("sabyy_user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Store tokens
export function storeTokens(accessToken: string, refreshToken: string, user: User): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("sabyy_access_token", accessToken);
  localStorage.setItem("sabyy_refresh_token", refreshToken);
  localStorage.setItem("sabyy_user", JSON.stringify(user));

  // Also set cookies so middleware (which runs server-side and can't read
  // localStorage) can recognize the session on protected routes.
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `sabyy_access_token=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `sabyy_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// Clear tokens
export function clearTokens(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("sabyy_access_token");
  localStorage.removeItem("sabyy_refresh_token");
  localStorage.removeItem("sabyy_user");

  document.cookie = "sabyy_access_token=; path=/; max-age=0";
  document.cookie = "sabyy_user=; path=/; max-age=0";
}

// Get stored tokens
export function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };

  return {
    accessToken: localStorage.getItem("sabyy_access_token"),
    refreshToken: localStorage.getItem("sabyy_refresh_token"),
  };
}
