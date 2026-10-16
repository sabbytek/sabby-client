import { request } from "@/lib/api/_transport";
import type { InventoryLevel, ListInventoryQuery, ReceiveStockRequest } from "@/lib/api/inventory.types";

/** Stock per variant per location. Not paginated. */
export function listInventory(query: ListInventoryQuery = {}): Promise<InventoryLevel[]> {
  return request<InventoryLevel[]>({ path: "/v1/inventory", method: "GET", query, mock: [] });
}

/** Owner/manager only. */
export function receiveStock(body: ReceiveStockRequest): Promise<unknown> {
  return request({ path: "/v1/inventory/receive", method: "POST", body });
}
