"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, logoutUser, getMe } from "@/lib/api/auth.api";
import { clearSession, getSession, storeSession } from "@/lib/api/session";
import { ApiError } from "@/lib/api/types";
import type { User } from "@/lib/api/auth.types";

type AuthContextType = {
  user: User | null;
  tenantSlug: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (tenantSlug: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loginErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === "NOT_FOUND") return "No business found with that handle.";
    if (err.status === 429) return "Too many attempts. Please wait a minute and try again.";
    if (err.status >= 500) return "Something went wrong on our side. Please try again shortly.";
    return err.message;
  }
  return err instanceof Error ? err.message : "Login failed";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from storage on mount. This must run in an
  // effect (not a useState initializer) so server and client first renders match.
  useEffect(() => {
    const session = getSession();
    if (session) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(session.user);
      setTenantSlug(session.tenantSlug);
      // Confirm the stored session is still valid. The transport refreshes an
      // expired access token; if that fails it dispatches auth:unauthorized.
      getMe().catch(() => {});
    } else {
      // Drop a stale marker cookie, or /login and /dashboard would redirect
      // to each other forever.
      clearSession();
    }
    setIsLoading(false);
  }, []);

  // Listen for 401 errors globally
  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      setUser(null);
      setTenantSlug(null);
      setError("Session expired. Please login again.");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(async (slug: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser({ tenantSlug: slug, email, password });

      storeSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        tenantSlug: slug,
        user: response.user,
      });
      setUser(response.user);
      setTenantSlug(slug);
    } catch (err) {
      const message = loginErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      const session = getSession();
      if (session) {
        await logoutUser(session.refreshToken);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearSession();
      setUser(null);
      setTenantSlug(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        tenantSlug,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
