"use client";

import { useState } from "react";
import {
  Plus,
  ShoppingBag,
  ClipboardCheck,
  FilePen,
  RotateCcw,
  Calendar,
  PackageOpen,
} from "lucide-react";
import { Guard, WRITE_ROLES } from "@/components/auth/guard";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState, Skeleton, TableSkeletonRows, UpgradeNotice } from "@/components/ui/states";
import { CHANNEL_LABELS, OrderStatusBadge, PaymentStatusBadge } from "@/components/dashboard/orders/order-badges";
import { OrderDetailModal } from "@/components/dashboard/orders/order-detail-modal";
import { CreateOrderModal } from "@/components/dashboard/orders/create-order-modal";
import { useOrderCount, useOrders } from "@/lib/queries/orders.queries";
import { errorMessage, isFeatureGated } from "@/lib/api/types";
import { formatCount, formatDate, formatKobo } from "@/lib/format";
import type { OrderChannel, OrderStatusFilter } from "@/lib/api/orders.types";

const CARD_SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]";

const STATUS_FILTERS: { label: string; value: OrderStatusFilter | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Draft", value: "draft" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

const TABLE_COLUMNS = ["Order Number", "Total", "Status", "Payment", "Channel", "Date"];

/** yyyy-mm-dd from a date input → ISO bound for that local day. */
function dayBound(value: string, end: boolean): string | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  const date = end ? new Date(y, m - 1, d, 23, 59, 59, 999) : new Date(y, m - 1, d);
  return date.toISOString();
}

export default function OrdersPage() {
  const [status, setStatus] = useState<OrderStatusFilter | undefined>(undefined);
  const [channel, setChannel] = useState<OrderChannel | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const query = {
    page,
    limit,
    status,
    channel: channel || undefined,
    from: dayBound(fromDate, false),
    to: dayBound(toDate, true),
  };
  const { data, isLoading, isFetching, error, refetch } = useOrders(query);

  const totalCount = useOrderCount();
  const fulfilledCount = useOrderCount({ status: "fulfilled" });
  const draftCount = useOrderCount({ status: "draft" });

  const stats = [
    { label: "Total Orders", query: totalCount, icon: ShoppingBag },
    { label: "Fulfilled Orders", query: fulfilledCount, icon: ClipboardCheck },
    { label: "Awaiting Confirmation", query: draftCount, icon: FilePen },
  ];

  // Any filter change goes back to the first page.
  const withReset = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  const hasFilters = !!(status || channel || fromDate || toDate);
  const items = data?.items ?? [];

  return (
    <div className="max-w-350 mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Orders</h1>
        <Guard role={WRITE_ROLES}>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus size={16} />
            Create Order
          </button>
        </Guard>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between ${CARD_SHADOW}`}
            >
              <div>
                <div className="text-[26px] leading-none font-semibold font-mono text-on-surface mb-2">
                  {stat.query.isLoading ? <Skeleton className="h-6.5 w-12" /> : stat.query.error ? "—" : formatCount(stat.query.data)}
                </div>
                <div className="text-xs text-on-surface-variant">{stat.label}</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant shrink-0">
                <Icon size={18} strokeWidth={1.75} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => withReset(setStatus)(f.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              status === f.value
                ? "bg-primary text-on-primary"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table container */}
      <div className={`bg-surface-container-lowest rounded-xl overflow-hidden ${CARD_SHADOW}`}>
        {/* Toolbar */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-outline-variant/40">
          <button
            type="button"
            onClick={() => void refetch()}
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <RotateCcw size={15} className={isFetching ? "animate-spin" : undefined} />
            {isLoading ? "Loading orders…" : `Showing ${items.length} of ${formatCount(data?.total)} Orders`}
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={channel}
              onChange={(e) => withReset(setChannel)(e.target.value as OrderChannel | "")}
              aria-label="Channel"
              className="text-sm font-medium text-on-surface-variant pl-3 pr-7 py-1.5 rounded-lg bg-surface-container-low focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All channels</option>
              {Object.entries(CHANNEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1.5 text-sm text-on-surface-variant px-3 py-1 rounded-lg bg-surface-container-low">
              <Calendar size={14} />
              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => withReset(setFromDate)(e.target.value)}
                aria-label="From date"
                className="bg-transparent text-sm focus:outline-none"
              />
              <span>–</span>
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => withReset(setToDate)(e.target.value)}
                aria-label="To date"
                className="bg-transparent text-sm focus:outline-none"
              />
            </div>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setStatus(undefined);
                  setChannel("");
                  setFromDate("");
                  setToDate("");
                  setPage(1);
                }}
                className="text-sm font-medium text-primary hover:underline px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {error && !data ? (
          isFeatureGated(error) ? (
            <UpgradeNotice feature="Orders" />
          ) : (
            <ErrorState message={errorMessage(error)} onRetry={() => void refetch()} />
          )
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-150">
              <thead>
                <tr className="text-xs text-on-surface-variant border-b border-outline-variant/40 bg-surface-container-low/40">
                  {TABLE_COLUMNS.map((col) => (
                    <th key={col} className="py-3 px-5 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={isFetching && !isLoading ? "opacity-60 transition-opacity" : undefined}>
                {isLoading ? (
                  <TableSkeletonRows columns={TABLE_COLUMNS.length} />
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={TABLE_COLUMNS.length}>
                      <EmptyState
                        icon={PackageOpen}
                        title={hasFilters ? "No orders match these filters" : "No orders yet"}
                        body={
                          hasFilters
                            ? "Try a different status, channel or date range."
                            : "When you make sales, they will appear here for easy tracking and fulfillment."
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  items.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedId(order.id)}
                      className="text-sm border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-low/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-5 font-medium text-on-surface">{order.orderNumber}</td>
                      <td className="py-3 px-5 font-mono">{formatKobo(order.totalKobo)}</td>
                      <td className="py-3 px-5">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-3 px-5">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="py-3 px-5 text-on-surface-variant">
                        {CHANNEL_LABELS[order.channel] ?? order.channel}
                      </td>
                      <td className="py-3 px-5 text-on-surface-variant whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / pagination */}
        <Pagination
          page={page}
          totalPages={data?.totalPages ?? 0}
          total={data?.total ?? 0}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={withReset(setLimit)}
          isFetching={isFetching}
        />
      </div>

      <OrderDetailModal orderId={selectedId} onClose={() => setSelectedId(null)} />
      <CreateOrderModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={(id) => setSelectedId(id)}
      />
    </div>
  );
}
