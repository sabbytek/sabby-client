import { request } from "@/lib/api/_transport";
import { emptyPage, type ApiPaginated } from "@/lib/api/types";
import type {
  CreateCustomerRequest,
  Customer,
  ListCustomersQuery,
  UpdateCustomerRequest,
} from "@/lib/api/customers.types";

export function listCustomers(query: ListCustomersQuery = {}): Promise<ApiPaginated<Customer>> {
  return request<ApiPaginated<Customer>>({
    path: "/v1/customers",
    method: "GET",
    query,
    mock: emptyPage(query.page, query.limit),
  });
}

export function getCustomer(id: string): Promise<Customer> {
  return request<Customer>({ path: `/v1/customers/${encodeURIComponent(id)}`, method: "GET" });
}

export function createCustomer(body: CreateCustomerRequest): Promise<Customer> {
  return request<Customer>({ path: "/v1/customers", method: "POST", body });
}

export function updateCustomer(id: string, body: UpdateCustomerRequest): Promise<Customer> {
  return request<Customer>({ path: `/v1/customers/${encodeURIComponent(id)}`, method: "PATCH", body });
}
