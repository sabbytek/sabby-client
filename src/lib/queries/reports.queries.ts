import { useQueries, useQuery } from "@tanstack/react-query";
import { getBestSellers, getInventoryValuation, getPLReport } from "@/lib/api/reports.api";
import { getWalletBalance } from "@/lib/api/ledger.api";
import { getSubscription } from "@/lib/api/subscriptions.api";
import type { BestSellersQuery, PLReport } from "@/lib/api/reports.types";

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const reportKeys = {
  pl: (from: string, to: string) => ["reports", "pl", from, to] as const,
  bestSellers: (query: BestSellersQuery) => ["reports", "best-sellers", query] as const,
  inventoryValuation: ["reports", "inventory-valuation"] as const,
  wallet: ["ledger", "wallet"] as const,
  subscription: ["subscription"] as const,
};

/** Local-time calendar month bounds as ISO strings. */
function monthRange(year: number, month: number): { from: string; to: string } {
  const from = new Date(year, month, 1);
  const to = new Date(year, month + 1, 1, 0, 0, 0, -1);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function yearRange(year: number): { from: string; to: string } {
  const from = new Date(year, 0, 1);
  const to = new Date(year + 1, 0, 1, 0, 0, 0, -1);
  return { from: from.toISOString(), to: to.toISOString() };
}

export type MonthlyPL = { month: string; report: PLReport | undefined };

/**
 * One P&L per month of the year (the backend has no time-series endpoint).
 * Future months are skipped. Requires `reporting:pl`; check `error` for 402.
 */
export function useMonthlyPL(year: number) {
  const now = new Date();
  const lastMonth = year < now.getFullYear() ? 11 : year > now.getFullYear() ? -1 : now.getMonth();
  const months = Array.from({ length: lastMonth + 1 }, (_, m) => m);

  return useQueries({
    queries: months.map((m) => {
      const { from, to } = monthRange(year, m);
      return {
        queryKey: reportKeys.pl(from, to),
        queryFn: () => getPLReport({ from, to }),
        staleTime: 5 * 60 * 1000,
      };
    }),
    combine: (results) => {
      const series: MonthlyPL[] = MONTHS.map((month, i) => ({ month, report: results[i]?.data }));
      const total = (pick: (r: PLReport) => number) =>
        results.reduce((sum, r) => sum + (r.data ? pick(r.data) : 0), 0);
      return {
        series,
        total,
        isLoading: results.some((r) => r.isLoading),
        error: results.find((r) => r.error)?.error ?? null,
      };
    },
  });
}

export function useBestSellers(query: BestSellersQuery) {
  return useQuery({ queryKey: reportKeys.bestSellers(query), queryFn: () => getBestSellers(query) });
}

export function useInventoryValuation(enabled = true) {
  return useQuery({ queryKey: reportKeys.inventoryValuation, queryFn: getInventoryValuation, enabled });
}

export function useWalletBalance() {
  return useQuery({ queryKey: reportKeys.wallet, queryFn: getWalletBalance });
}

export function useSubscription() {
  return useQuery({ queryKey: reportKeys.subscription, queryFn: getSubscription, staleTime: 5 * 60 * 1000 });
}
