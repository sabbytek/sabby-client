export type LoginRequest = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  merchant_id: string;
  merchant_name: string;
  role: "admin" | "manager" | "staff";
  permissions: string[];
  avatar?: string;
};

export type AuthResponse = {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type LogoutRequest = {
  refresh_token: string;
};
