// Mirrors oniraja-server src/modules/customers and the `customers` table.

export type ConsentSource = "pos_signup" | "whatsapp_chat" | "web_checkout" | "manual";

export type Customer = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  note: string | null;
  /** NDPR: when the customer consented to data collection. */
  consentGivenAt: string | null;
  consentSource: ConsentSource | null;
  createdAt: string;
  updatedAt: string;
};

export type ListCustomersQuery = {
  page?: number;
  limit?: number;
  /** Matches first name, phone or email. */
  search?: string;
};

export type CreateCustomerRequest = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  consentGivenAt?: string;
  consentSource?: ConsentSource;
};

export type UpdateCustomerRequest = {
  firstName?: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  note?: string | null;
  consentGivenAt?: string | null;
  consentSource?: ConsentSource | null;
};
