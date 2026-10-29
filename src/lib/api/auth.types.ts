// Mirrors SabbyPOS src/modules/auth (validators.ts, service.ts, controller.ts).

export type UserRole = "owner" | "manager" | "staff" | "viewer";

export type LoginRequest = {
  tenantSlug: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type RefreshResponse = {
  accessToken: string;
};

/** GET /v1/auth/me — claims from the access token, not the full profile. */
export type MeResponse = {
  userId: string;
  tenantId: string;
  email: string;
  role: UserRole;
};

/** POST /v1/tenants — public merchant signup. */
export type SignupRequest = {
  name: string;
  slug: string;
  businessEmail: string;
  businessPhone?: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPassword: string;
};

export type SignupResponse = {
  tenantId: string;
  slug: string;
  message: string;
};
