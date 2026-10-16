"use client";

import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/lib/api/auth.types";

export const MANAGER_ROLES: UserRole[] = ["owner", "manager"];
export const WRITE_ROLES: UserRole[] = ["owner", "manager", "staff"];

export function useHasRole(roles: UserRole[]): boolean {
  const { user } = useAuth();
  return !!user && roles.includes(user.role);
}

/** Renders children only for the given roles: hidden, not blocked. */
export function Guard({ role, children }: { role: UserRole[]; children: React.ReactNode }) {
  return useHasRole(role) ? <>{children}</> : null;
}
