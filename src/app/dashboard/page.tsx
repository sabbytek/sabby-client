"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import { MANAGER_ROLES, WRITE_ROLES, useHasRole } from "@/components/auth/guard";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { OrderStatusBadge, CHANNEL_LABELS } from "@/components/dashboard/orders/order-badges";
import { OrderDetailModal } from "@/components/dashboard/orders/order-detail-modal";
import { CreateOrderModal } from "@/components/dashboard/orders/create-order-modal";
import { CreateProductModal } from "@/components/dashboard/products/create-product-modal";
import { CustomerFormModal } from "@/components/dashboard/customers/customer-form-modal";
import { Skeleton, TableSkeletonRows } from "@/components/ui/states";
import { useOrderCount, useOrders } from "@/lib/queries/orders.queries";
import { useInventory, useProducts } from "@/lib/queries/products.queries";
import { useCustomers } from "@/lib/queries/customers.queries";
import { useMonthlyPL, useSubscription, useWalletBalance, yearRange } from "@/lib/queries/reports.queries";
import { exportPLReport } from "@/lib/api/reports.api";
import { errorMessage, isFeatureGated } from "@/lib/api/types";
import { saveTextFile } from "@/lib/download";
import { formatCount, formatDate, formatKobo } from "@/lib/format";
import type { Subscription } from "@/lib/api/subscriptions.types";
import {
  Info,
  Wallet,
  TrendingUp,
  PiggyBank,
  Store,
  Download,
  LineChart,
  Rocket,
  ArrowRight,
  Inbox,
  Tag,
  UserPlus,
  AlertTriangle,
  Package,
  PlusCircle,
  PackagePlus,
  Bot,
  Gift,
  Copy,
  BarChart3,
  CheckCircle2,
  Lock,
  type LucideIcon,
} from "lucide-react";

const CARD = "bg-surface-container-lowest rounded-xl shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]";
const CARD_HOVER = "hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_6px_20px_rgba(16,24,40,0.08)] transition-shadow";

const THIS_YEAR = new Date().getFullYear();
const CHANNELS = ["website", "pos", "whatsapp", "manual"] as const;

function planLabel(sub: Subscription): string {
  if (sub.status === "trial") {
    if (!sub.trialEndsAt) return "You're on a free trial";
    const days = Math.ceil((new Date(sub.trialEndsAt).getTime() - Date.now()) / 86_400_000);
    if (days <= 0) return "Your trial has ended";
    return `Trial expires in ${days} day${days === 1 ? "" : "s"}`;
  }
  if (sub.status === "lapsed") return "Your subscription has lapsed";
  if (sub.status === "grace") return "Payment overdue, renew soon";
  return `${sub.planTier.charAt(0).toUpperCase()}${sub.planTier.slice(1)} plan`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.firstName || "there";
  const referralCode = (user ? `${user.firstName}${user.lastName}` : "SABYY").replace(/\s+/g, "").slice(0, 10).toUpperCase();

  const canWrite = useHasRole(WRITE_ROLES);
  const isManager = useHasRole(MANAGER_ROLES);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<"order" | "product" | "customer" | null>(null);

  const subscription = useSubscription();
  const wallet = useWalletBalance();
  const pl = useMonthlyPL(THIS_YEAR);
  const plGated = isFeatureGated(pl.error);

  const orderCount = useOrderCount();
  const productCount = useProducts({ page: 1, limit: 1 });
  const customerCount = useCustomers({ page: 1, limit: 1 });
  const inventory = useInventory();
  const recentOrders = useOrders({ page: 1, limit: 5 });

  const websiteCount = useOrderCount({ channel: "website" });
  const posCount = useOrderCount({ channel: "pos" });
  const whatsappCount = useOrderCount({ channel: "whatsapp" });
  const manualCount = useOrderCount({ channel: "manual" });
  const channelCounts = [websiteCount, posCount, whatsappCount, manualCount];

  const lowStock = (inventory.data ?? []).filter((r) => r.quantityOnHand <= r.lowStockThreshold).length;

  const plValue = (pick: Parameters<typeof pl.total>[0]): string | undefined | "locked" =>
    plGated ? "locked" : pl.isLoading ? undefined : pl.error ? "—" : formatKobo(pl.total(pick));

  const metrics: { label: string; value: string | undefined | "locked"; icon: LucideIcon; footer: string }[] = [
    { label: "Total Sales", value: plValue((r) => r.revenueKobo), icon: TrendingUp, footer: `Revenue in ${THIS_YEAR}` },
    {
      label: "Wallet Balance",
      value: wallet.isLoading ? undefined : wallet.error ? "—" : formatKobo(wallet.data?.balanceKobo),
      icon: Wallet,
      footer: "Cash account balance",
    },
    { label: "Net Profit", value: plValue((r) => r.netProfitKobo), icon: PiggyBank, footer: `After costs, ${THIS_YEAR}` },
    {
      label: "POS Orders",
      value: posCount.isLoading ? undefined : posCount.error ? "—" : formatCount(posCount.data),
      icon: Store,
      footer: "In-store transactions",
    },
  ];

  const todoItems = [
    {
      icon: PackagePlus,
      title: "Add Your First Product",
      body: "Give customers something to buy.",
      done: (productCount.data?.total ?? 0) > 0,
      href: "/dashboard/products",
    },
    {
      icon: UserPlus,
      title: "Add Your First Customer",
      body: "Keep track of who buys from you.",
      done: (customerCount.data?.total ?? 0) > 0,
      href: "/dashboard/customers",
    },
    {
      icon: Inbox,
      title: "Record First Order",
      body: "Start tracking your business sales.",
      done: (orderCount.data ?? 0) > 0,
      href: "/dashboard/orders",
    },
  ];
  const completedTodos = todoItems.filter((t) => t.done).length;

  const miniMetrics: { icon: LucideIcon; value: number | undefined; label: string; href: string }[] = [
    { icon: Inbox, value: orderCount.data, label: "Orders", href: "/dashboard/orders" },
    { icon: Tag, value: productCount.data?.total, label: "Products", href: "/dashboard/products" },
    { icon: UserPlus, value: customerCount.data?.total, label: "Customers", href: "/dashboard/customers" },
    { icon: AlertTriangle, value: inventory.data ? lowStock : undefined, label: "Low Stock", href: "/dashboard/products" },
  ];

  const quickActions: { icon: LucideIcon; title: string; body: string; onClick?: () => void; href?: string; show: boolean }[] = [
    { icon: PlusCircle, title: "Create New Order", body: "Manually record a sale", onClick: () => setOpenModal("order"), show: canWrite },
    { icon: PackagePlus, title: "Add New Product", body: "Expand your inventory", onClick: () => setOpenModal("product"), show: isManager },
    { icon: UserPlus, title: "Add New Customer", body: "Grow your contact list", onClick: () => setOpenModal("customer"), show: canWrite },
    { icon: Bot, title: "Ask Assistant", body: "Get help with your store", show: true },
  ];

  const topChannel = channelCounts.every((c) => c.data !== undefined)
    ? CHANNELS.map((ch, i) => ({ channel: ch, count: channelCounts[i].data ?? 0 })).sort((a, b) => b.count - a.count)[0]
    : undefined;
  const channelTotal = channelCounts.reduce((s, c) => s + (c.data ?? 0), 0);

  const chartHasData = pl.series.some((p) => (p.report?.revenueKobo ?? 0) !== 0);

  const exportCsv = async () => {
    try {
      const csv = await exportPLReport(yearRange(THIS_YEAR));
      saveTextFile(`profit-and-loss-${THIS_YEAR}.csv`, csv);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't export the report"));
    }
  };

  return (
    <div className="max-w-350 mx-auto flex flex-col gap-5">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-1">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight mb-1">Hello {firstName},</h1>
          <p className="text-on-surface-variant text-sm">Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        {subscription.data && (
          <div className="flex items-center gap-3 rounded-lg pl-3.5 pr-1.5 py-1.5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm">
              <Info size={15} />
              <span>{planLabel(subscription.data)}</span>
            </div>
            {subscription.data.planTier !== "enterprise" && (
              <button
                type="button"
                className="bg-primary text-on-primary px-3.5 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Upgrade Plan
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-5 auto-rows-[minmax(140px,auto)]">
        {/* Metric cards */}
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className={`xl:col-span-3 p-5 flex flex-col justify-between ${CARD} ${CARD_HOVER}`}>
              <div className="flex items-center gap-2 text-on-surface-variant mb-4">
                <Icon size={16} strokeWidth={1.75} />
                <span className="text-xs uppercase tracking-wider font-medium">{metric.label}</span>
              </div>
              <div className="text-[28px] leading-none font-semibold font-mono text-on-surface">
                {metric.value === undefined ? (
                  <Skeleton className="h-7 w-28" />
                ) : metric.value === "locked" ? (
                  <span className="flex items-center gap-1.5 text-sm font-sans font-medium text-on-surface-variant">
                    <Lock size={14} /> Upgrade to see
                  </span>
                ) : (
                  metric.value
                )}
              </div>
              <div className="text-xs text-on-surface-variant mt-2">{metric.footer}</div>
            </div>
          );
        })}

        {/* Sales Overview Chart */}
        <div className={`xl:col-span-6 xl:row-span-2 p-6 flex flex-col ${CARD}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-semibold text-on-surface">Sales Overview</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Monthly revenue and net profit, {THIS_YEAR}</p>
            </div>
            {!plGated && (
              <button
                type="button"
                onClick={() => void exportCsv()}
                aria-label="Download profit and loss CSV"
                className="p-1.5 text-on-surface-variant hover:bg-surface-container-low rounded-lg border border-outline-variant/60 transition-colors"
              >
                <Download size={16} />
              </button>
            )}
          </div>
          {pl.isLoading ? (
            <Skeleton className="flex-1 min-h-60" />
          ) : plGated || !chartHasData ? (
            <div className="flex-1 border-t border-b border-outline-variant/40 flex flex-col justify-center items-center my-2 min-h-60">
              <div className="text-center max-w-sm">
                {plGated ? (
                  <Lock size={28} className="text-on-surface-variant/40 mb-3 mx-auto" strokeWidth={1.5} />
                ) : (
                  <LineChart size={28} className="text-on-surface-variant/40 mb-3 mx-auto" strokeWidth={1.5} />
                )}
                <h4 className="text-sm font-semibold text-on-surface mb-1.5">
                  {plGated ? "Sales reports aren't on your plan" : "No sales data yet"}
                </h4>
                <p className="text-xs text-on-surface-variant mb-4">
                  {plGated
                    ? "Upgrade your plan to see monthly sales and profit."
                    : "Record your first order to start visualizing your business growth."}
                </p>
                {!plGated && canWrite && (
                  <button
                    type="button"
                    onClick={() => setOpenModal("order")}
                    className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Record Order
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <MonthlyChart
                height={260}
                data={pl.series.map((p) => ({
                  month: p.month,
                  revenue: p.report?.revenueKobo ?? null,
                  profit: p.report?.netProfitKobo ?? null,
                }))}
                series={[
                  { key: "revenue", label: "Revenue", color: "#630ed4" },
                  { key: "profit", label: "Net Profit", color: "#6f5092" },
                ]}
              />
              <div className="flex justify-center items-center gap-6 mt-4 text-xs text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" /> Revenue
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary" /> Net Profit
                </div>
              </div>
            </>
          )}
        </div>

        {/* Store Setup To-do */}
        <div className={`xl:col-span-3 xl:row-span-2 p-5 flex flex-col ${CARD}`}>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-base font-semibold text-on-surface">Store Setup</h3>
            <span className="text-xs text-on-surface-variant">
              {completedTodos}/{todoItems.length}
            </span>
          </div>
          <div className="w-full h-1 bg-surface-container-low rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(completedTodos / todoItems.length) * 100}%` }}
            />
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {todoItems.map((item) => {
              const Icon = item.done ? CheckCircle2 : item.icon;
              return (
                <Link key={item.title} href={item.href} className="group flex gap-3 items-start p-3 rounded-lg transition-colors">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.done ? "bg-success-bg text-success" : "bg-surface-container-low text-on-surface-variant"
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-medium mb-0.5 group-hover:text-primary transition-colors ${
                        item.done ? "text-on-surface-variant line-through" : "text-on-surface"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-tight">{item.body}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Onboarding + Mini Metrics */}
        <div className="xl:col-span-3 xl:row-span-2 flex flex-col gap-5">
          <div className={`p-5 flex-1 flex flex-col justify-center ${CARD}`}>
            <div className="w-9 h-9 bg-primary text-on-primary rounded-lg flex items-center justify-center mb-3">
              <Rocket size={18} />
            </div>
            <h2 className="text-sm font-semibold text-on-surface mb-1.5">Launch your website</h2>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Complete the final steps to activate your online presence.
            </p>
            <button
              type="button"
              className="w-full bg-primary text-on-primary py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
            >
              Activate Website
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {miniMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Link
                  key={metric.label}
                  href={metric.href}
                  className={`p-3 flex flex-col justify-center items-center text-center ${CARD} ${CARD_HOVER}`}
                >
                  <Icon size={18} strokeWidth={1.75} className="text-on-surface-variant mb-1.5" />
                  <span className="text-lg font-semibold text-on-surface">
                    {metric.value === undefined ? <Skeleton className="h-6 w-8" /> : formatCount(metric.value)}
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">{metric.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className={`xl:col-span-6 xl:row-span-2 flex flex-col overflow-hidden ${CARD}`}>
          <div className="p-5 border-b border-outline-variant/60 flex justify-between items-center">
            <h3 className="text-base font-semibold text-on-surface">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-primary text-sm font-medium hover:underline">
              View Full List
            </Link>
          </div>
          <div className="flex-1 w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-150">
              <thead>
                <tr className="text-xs text-on-surface-variant border-b border-outline-variant/40">
                  <th className="py-3 px-5 font-medium">Order Details</th>
                  <th className="py-3 px-5 font-medium">Amount</th>
                  <th className="py-3 px-5 font-medium">Status</th>
                  <th className="py-3 px-5 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.isLoading ? (
                  <TableSkeletonRows columns={4} rows={4} />
                ) : (recentOrders.data?.items ?? []).length === 0 ? (
                  <tr>
                    <td className="py-16 text-center" colSpan={4}>
                      <div className="flex flex-col items-center justify-center text-on-surface-variant max-w-sm mx-auto">
                        <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center mb-3">
                          <Package size={22} className="text-on-surface-variant" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-on-surface mb-1">
                          {recentOrders.error ? "Couldn't load orders" : "No orders recorded yet"}
                        </p>
                        <p className="text-xs text-center">
                          {recentOrders.error
                            ? errorMessage(recentOrders.error)
                            : "When you make sales, they will appear here for easy tracking and fulfillment."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentOrders.data!.items.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className="text-sm border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-low/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-5">
                        <div className="font-medium text-on-surface">{order.orderNumber}</div>
                        <div className="text-xs text-on-surface-variant">{CHANNEL_LABELS[order.channel] ?? order.channel}</div>
                      </td>
                      <td className="py-3 px-5 font-mono">{formatKobo(order.totalKobo)}</td>
                      <td className="py-3 px-5">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-3 px-5 text-on-surface-variant whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="xl:col-span-3 xl:row-span-2 bg-surface-container-lowest rounded-xl p-5 flex flex-col">
          <h3 className="text-base font-semibold text-on-surface mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-2 flex-1 auto-rows-max">
            {quickActions
              .filter((a) => a.show)
              .map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    type="button"
                    onClick={action.onClick}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                      <Icon size={16} strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-on-surface">{action.title}</div>
                      <div className="text-xs text-on-surface-variant">{action.body}</div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Refer & Earn + Top Channel */}
        <div className="xl:col-span-3 xl:row-span-2 flex flex-col gap-5">
          <div className="bg-[#046C4E] rounded-xl p-5 text-white flex-1 flex flex-col shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">Refer & Earn</h3>
                <p className="text-xs opacity-80 leading-relaxed max-w-50">Help others discover us &amp; earn rewards.</p>
              </div>
              <Gift size={22} className="opacity-80" strokeWidth={1.75} />
            </div>
            <div className="mt-auto bg-white/10 rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Your Code</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-widest">{referralCode}</span>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(referralCode).then(() => toast.success("Code copied"));
                  }}
                  aria-label="Copy referral code"
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <button
              type="button"
              className="w-full bg-white text-[#046C4E] py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity mt-3"
            >
              View Earnings
            </button>
          </div>

          <div className={`p-5 flex-1 flex flex-col items-center justify-center text-center ${CARD}`}>
            <h3 className="text-sm font-medium text-on-surface mb-3 self-start w-full text-left">Top Sales Channel</h3>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-3">
              <BarChart3 size={18} strokeWidth={1.75} />
            </div>
            {topChannel === undefined ? (
              <Skeleton className="h-4 w-32 mb-3" />
            ) : topChannel.count === 0 ? (
              <p className="text-xs text-on-surface-variant mb-3">Not enough data to determine top channels.</p>
            ) : (
              <div className="mb-3">
                <p className="text-sm font-semibold text-on-surface">{CHANNEL_LABELS[topChannel.channel]}</p>
                <p className="text-xs text-on-surface-variant">
                  {formatCount(topChannel.count)} of {formatCount(channelTotal)} orders
                </p>
              </div>
            )}
            <Link href="/dashboard/analytics" className="text-primary text-xs font-medium hover:underline">
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      <OrderDetailModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      <CreateOrderModal
        open={openModal === "order"}
        onOpenChange={(open) => setOpenModal(open ? "order" : null)}
        onCreated={(id) => setSelectedOrderId(id)}
      />
      <CreateProductModal open={openModal === "product"} onOpenChange={(open) => setOpenModal(open ? "product" : null)} />
      <CustomerFormModal open={openModal === "customer"} onOpenChange={(open) => setOpenModal(open ? "customer" : null)} />
    </div>
  );
}
