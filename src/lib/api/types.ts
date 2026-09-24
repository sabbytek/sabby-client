/**
 * Standard response envelope from backend.
 * Confirm actual shape with backend dev — this assumes a wrapper.
 */
export type ApiEnvelope<TPayload = unknown> = {
  status?: boolean;
  code?: number;
  message?: string;
  payload?: TPayload;
};

export type ApiListResponse<T> = {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};
