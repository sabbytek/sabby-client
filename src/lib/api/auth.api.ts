import { request } from "@/lib/api/_transport";
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "@/lib/api/auth.types";

// Mock data, used only when NEXT_PUBLIC_USE_MOCK=true
const MOCK_USER: User = {
  id: "user_123",
  email: "merchant@sabyy.app",
  firstName: "Femi",
  lastName: "Adeleke",
  role: "owner",
};

export function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>({
    path: "/v1/auth/login",
    method: "POST",
    body: payload,
    auth: false,
    mock: {
      user: MOCK_USER,
      accessToken: "mock_access_token",
      refreshToken: "mock_refresh_token",
    },
  });
}

export function signupMerchant(payload: SignupRequest): Promise<SignupResponse> {
  return request<SignupResponse>({
    path: "/v1/tenants",
    method: "POST",
    body: payload,
    auth: false,
    mock: {
      tenantId: "tenant_456",
      slug: payload.slug,
      message: "Tenant provisioned successfully. Use your business email to log in.",
    },
  });
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await request({
    path: "/v1/auth/logout",
    method: "POST",
    body: { refreshToken },
    mock: { message: "Logged out successfully" },
  });
}

export function getMe(): Promise<MeResponse> {
  return request<MeResponse>({
    path: "/v1/auth/me",
    method: "GET",
    mock: {
      userId: MOCK_USER.id,
      tenantId: "tenant_456",
      email: MOCK_USER.email,
      role: MOCK_USER.role,
    },
  });
}
