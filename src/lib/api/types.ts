/**
 * Response envelopes as sent by the BPOS backend (SabbyPOS).
 * Success: sendSuccess() in src/shared/http/response.ts
 * Failure: errorHandler() in src/shared/errors/handler.ts
 */
export type ApiSuccess<TData> = {
  success: true;
  data: TData;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiEnvelope<TData> = ApiSuccess<TData> | ApiFailure;

/**
 * Shape of `data` for merchant list endpoints (orders, products, customers,
 * inventory, expenses, ledger). The platform/admin plane nests these fields
 * under `pagination` instead (sendPaginated), which this client never calls.
 */
export type ApiPaginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
