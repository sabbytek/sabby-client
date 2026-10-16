import { request } from "@/lib/api/_transport";
import type {
  BestSellerRow,
  BestSellersQuery,
  DateRangeQuery,
  InventoryValuation,
  PLReport,
} from "@/lib/api/reports.types";

export function getPLReport(query: DateRangeQuery): Promise<PLReport> {
  return request<PLReport>({
    path: "/v1/reports/pl",
    method: "GET",
    query,
    mock: {
      ...query,
      revenueKobo: 0,
      cogsKobo: 0,
      grossProfitKobo: 0,
      operatingExpensesKobo: 0,
      paymentFeesKobo: 0,
      refundsKobo: 0,
      netProfitKobo: 0,
    },
  });
}

/** CSV text of the P&L for the range. Same plan gate as getPLReport. */
export function exportPLReport(query: DateRangeQuery): Promise<string> {
  return request<string>({
    path: "/v1/reports/pl/export",
    method: "GET",
    query,
    responseType: "text",
    mock: "Category,Amount (NGN)\n",
  });
}

export function getBestSellers(query: BestSellersQuery = {}): Promise<BestSellerRow[]> {
  return request<BestSellerRow[]>({ path: "/v1/reports/best-sellers", method: "GET", query, mock: [] });
}

/** Cost-based stock value. Gated by `reporting:margin` (Entry plan and above). */
export function getInventoryValuation(): Promise<InventoryValuation> {
  return request<InventoryValuation>({
    path: "/v1/reports/inventory-valuation",
    method: "GET",
    mock: { rows: [], totalValueKobo: 0 },
  });
}
