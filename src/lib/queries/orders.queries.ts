import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder, getOrder, listOrders, transitionOrder } from "@/lib/api/orders.api";
import type { CreateOrderRequest, ListOrdersQuery, OrderTransition, OrderWithItems } from "@/lib/api/orders.types";

export const orderKeys = {
  all: ["orders"] as const,
  list: (query: ListOrdersQuery) => ["orders", "list", query] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

export function useOrders(query: ListOrdersQuery) {
  return useQuery({
    queryKey: orderKeys.list(query),
    queryFn: () => listOrders(query),
    placeholderData: keepPreviousData,
  });
}

/** Total count for a filter, read from a one-row page. */
export function useOrderCount(query: Omit<ListOrdersQuery, "page" | "limit"> = {}) {
  return useQuery({
    queryKey: orderKeys.list({ ...query, page: 1, limit: 1 }),
    queryFn: () => listOrders({ ...query, page: 1, limit: 1 }),
    select: (data) => data.total,
  });
}

export function useOrder(id: string | null) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ""),
    queryFn: () => getOrder(id!),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOrderRequest) => createOrder(body),
    onSuccess: () => {
      // Refetch in the background; awaiting it would keep the mutation pending until every list reloads.
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useTransitionOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: OrderTransition }) => transitionOrder(id, action),
    onSuccess: (order) => {
      // Show the new status right away; the response has the order but not its items.
      queryClient.setQueryData<OrderWithItems>(orderKeys.detail(order.id), (prev) =>
        prev ? { ...prev, ...order } : prev,
      );
      // Confirm and cancel move stock, so inventory views are stale too.
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}
