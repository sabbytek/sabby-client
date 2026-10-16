import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCustomer, listCustomers, updateCustomer } from "@/lib/api/customers.api";
import type { CreateCustomerRequest, ListCustomersQuery, UpdateCustomerRequest } from "@/lib/api/customers.types";

export const customerKeys = {
  all: ["customers"] as const,
  list: (query: ListCustomersQuery) => ["customers", "list", query] as const,
};

export function useCustomers(query: ListCustomersQuery, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: customerKeys.list(query),
    queryFn: () => listCustomers(query),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCustomerRequest) => createCustomer(body),
    onSuccess: () => {
      // Refetch in the background; awaiting it would keep the mutation pending until every list reloads.
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCustomerRequest }) => updateCustomer(id, body),
    onSuccess: () => {
      // Refetch in the background; awaiting it would keep the mutation pending until every list reloads.
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}
