import { request } from "@/lib/api/_transport";
import { emptyPage, type ApiPaginated } from "@/lib/api/types";
import type {
  CreateOrderRequest,
  ListOrdersQuery,
  Order,
  OrderTransition,
  OrderWithItems,
} from "@/lib/api/orders.types";

export function listOrders(query: ListOrdersQuery = {}): Promise<ApiPaginated<Order>> {
  return request<ApiPaginated<Order>>({
    path: "/v1/orders",
    method: "GET",
    query,
    mock: emptyPage(query.page, query.limit),
  });
}

export function getOrder(id: string): Promise<OrderWithItems> {
  return request<OrderWithItems>({ path: `/v1/orders/${encodeURIComponent(id)}`, method: "GET" });
}

export function createOrder(body: CreateOrderRequest): Promise<OrderWithItems> {
  return request<OrderWithItems>({ path: "/v1/orders", method: "POST", body });
}

/** confirm and cancel need owner/manager; process and fulfil any role with orders access. */
export function transitionOrder(id: string, action: OrderTransition): Promise<Order> {
  return request<Order>({
    path: `/v1/orders/${encodeURIComponent(id)}/${action}`,
    method: "POST",
  });
}
