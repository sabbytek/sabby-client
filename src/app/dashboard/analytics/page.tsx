"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Download, Calendar, Trophy } from "lucide-react";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { EmptyState, ErrorState, Skeleton, TableSkeletonRows, UpgradeNotice } from "@/components/ui/states";
import { useBestSellers, useMonthlyPL, yearRange } from "@/lib/queries/reports.queries";
import { exportPLReport } from "@/lib/api/reports.api";
import { errorMessage, isFeatureGated } from "@/lib/api/types";
import { saveTextFile } from "@/lib/download";
import { formatCount, formatKobo } from "@/lib/format";
import type { PLReport } from "@/lib/api/reports.types";

const CARD_SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]";

const TABS = ["Sales", "Products", "Transactions", "Customers", "Campaigns"] as const;
type Tab = (typeof TABS)[number];

// Every metric the backend's P&L report returns.
const SALES_METRICS: { label: string; pick: (r: PLReport) => number; color: string }[] = [
  { label: "Total Sales", pick: (r) => r.revenueKobo, color: "#630ed4" },
  { label: "Gross Profit", pick: (r) => r.grossProfitKobo, color: "#046C4E" },
  { label: "Net Profit", pick: (r) => r.netProfitKobo, color: "#046C4E" },
  { label: "Cost of Goods Sold", pick: (r) => r.cogsKobo, color: "#6f5092" },
  { label: "Expenses", pick: (r) => r.operatingExpensesKobo, color: "#ba1a1a" },
  { label: "Payment Fees", pick: (r) => r.paymentFeesKobo, color: "#6f5092" },
  { label: "Refunds", pick: (r) => r.refundsKobo, color: "#ba1a1a" },
];

const THIS_YEAR = new Date().getFullYear();
const YEARS = [THIS_YEAR, THIS_YEAR - 1, THIS_YEAR - 2];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Sales");
  const [year, setYear] = useState(THIS_YEAR);
  const [isExporting, setIsExporting] = useState(false);

  const pl = useMonthlyPL(year);
  const range = yearRange(year);
  const bestSellers = useBestSellers({ ...range, limit: 20 });
  const gated = isFeatureGated(pl.error);

  const exportCsv = async () => {
    setIsExporting(true);
    try {
      const csv = await exportPLReport(range);
      saveTextFile(`profit-and-loss-${year}.csv`, csv);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't export the report"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-350 mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Analytics</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {!gated && (
            <div className="flex items-center gap-2 bg-surface-container-low pl-3.5 pr-1.5 py-1.5 rounded-lg">
              <span className="text-sm text-on-surface-variant whitespace-nowrap">Profit &amp; loss report</span>
              <button
                type="button"
                onClick={() => void exportCsv()}
                disabled={isExporting}
                aria-label="Download profit and loss CSV"
                className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Download size={14} />
              </button>
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-on-surface px-3.5 py-2 rounded-lg bg-surface-container-lowest">
            <Calendar size={14} />
            <span className="sr-only">Year</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-transparent focus:outline-none"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  Jan 1 – Dec 31, {y}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Sub-nav tabs */}
      <div className="flex items-center gap-6 border-b border-outline-variant/40 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-on-surface"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "Sales" ? (
        gated ? (
          <div className={`bg-surface-container-lowest rounded-xl ${CARD_SHADOW}`}>
            <UpgradeNotice feature="Profit & loss reports" />
          </div>
        ) : pl.error ? (
          <div className={`bg-surface-container-lowest rounded-xl ${CARD_SHADOW}`}>
            <ErrorState message={errorMessage(pl.error)} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {SALES_METRICS.map((metric) => (
              <div key={metric.label} className={`bg-surface-container-lowest rounded-xl p-5 ${CARD_SHADOW}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm text-on-surface-variant">{metric.label}</span>
                  <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: metric.color }} />
                    {year}
                  </span>
                </div>
                <div className="text-2xl font-semibold text-on-surface mb-4">
                  {pl.isLoading ? <Skeleton className="h-8 w-32" /> : formatKobo(pl.total(metric.pick))}
                </div>
                <MonthlyChart
                  data={pl.series.map((p) => ({ month: p.month, value: p.report ? metric.pick(p.report) : null }))}
                  series={[{ key: "value", label: metric.label, color: metric.color }]}
                />
              </div>
            ))}
          </div>
        )
      ) : activeTab === "Products" ? (
        <div className={`bg-surface-container-lowest rounded-xl overflow-hidden ${CARD_SHADOW}`}>
          <div className="p-5 border-b border-outline-variant/40">
            <h3 className="text-base font-semibold text-on-surface">Best sellers</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Top products by quantity sold in {year}</p>
          </div>
          {isFeatureGated(bestSellers.error) ? (
            <UpgradeNotice feature="Best-seller reports" />
          ) : bestSellers.error ? (
            <ErrorState message={errorMessage(bestSellers.error)} onRetry={() => void bestSellers.refetch()} />
          ) : !bestSellers.isLoading && (bestSellers.data ?? []).length === 0 ? (
            <EmptyState icon={Trophy} title="No sales yet" body={`Products you sell in ${year} will be ranked here.`} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-150">
                <thead>
                  <tr className="text-xs text-on-surface-variant border-b border-outline-variant/40 bg-surface-container-low/40">
                    <th className="py-3 px-5 font-medium w-12">#</th>
                    <th className="py-3 px-5 font-medium">Product</th>
                    <th className="py-3 px-5 font-medium">SKU</th>
                    <th className="py-3 px-5 font-medium text-right">Units sold</th>
                    <th className="py-3 px-5 font-medium text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellers.isLoading ? (
                    <TableSkeletonRows columns={5} />
                  ) : (
                    bestSellers.data!.map((row, i) => (
                      <tr key={row.variantId} className="border-b border-outline-variant/30 last:border-0">
                        <td className="py-3 px-5 text-on-surface-variant">{i + 1}</td>
                        <td className="py-3 px-5 font-medium text-on-surface">
                          {row.productName}
                          {row.variantName !== row.productName && (
                            <span className="text-on-surface-variant font-normal"> — {row.variantName}</span>
                          )}
                        </td>
                        <td className="py-3 px-5 font-mono text-xs">{row.sku}</td>
                        <td className="py-3 px-5 text-right">{formatCount(row.totalQuantity)}</td>
                        <td className="py-3 px-5 text-right font-mono">{formatKobo(row.totalRevenueKobo)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className={`bg-surface-container-lowest rounded-xl p-16 flex flex-col items-center justify-center text-center ${CARD_SHADOW}`}>
          <p className="text-sm text-on-surface-variant">
            {activeTab} analytics are coming soon.
          </p>
        </div>
      )}
    </div>
  );
}
