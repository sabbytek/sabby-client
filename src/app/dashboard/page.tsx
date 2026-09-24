"use client";

import { useAuth } from "@/contexts/auth-context";
import {
  Info,
  Wallet,
  TrendingUp,
  Hourglass,
  Store,
  Download,
  LineChart,
  FileText,
  ImageIcon,
  Receipt,
  Rocket,
  ArrowRight,
  Inbox,
  Tag,
  UserPlus,
  Globe,
  Package,
  PlusCircle,
  PackagePlus,
  Megaphone,
  Bot,
  Gift,
  Copy,
  BarChart3,
} from "lucide-react";

const METRICS = [
  {
    label: "Total Sales",
    value: "₦0.00",
    icon: Wallet,
    footer: "0% vs last month",
    trend: "flat" as const,
  },
  {
    label: "Total Settled",
    value: "₦0.00",
    icon: TrendingUp,
    footer: "Ready for payout",
  },
  {
    label: "Total Owed",
    value: "₦0.00",
    icon: Hourglass,
    footer: "Pending collection",
  },
  {
    label: "Offline Sales",
    value: "₦0.00",
    icon: Store,
    footer: "POS transactions",
  },
];

const TODO_ITEMS = [
  {
    icon: FileText,
    title: "Add Store Description",
    body: "Help visitors understand what you sell.",
  },
  {
    icon: ImageIcon,
    title: "Upload Store Image",
    body: "Make your store visually appealing.",
  },
  {
    icon: Receipt,
    title: "Record First Order",
    body: "Start tracking your business sales.",
  },
];

const MINI_METRICS = [
  { icon: Inbox, value: 0, label: "Orders" },
  { icon: Tag, value: 0, label: "Products Sold" },
  { icon: UserPlus, value: 0, label: "Customers" },
  { icon: Globe, value: 0, label: "Visits" },
];

const QUICK_ACTIONS = [
  { icon: PlusCircle, title: "Create New Order", body: "Manually record a sale" },
  { icon: PackagePlus, title: "Add New Product", body: "Expand your inventory" },
  { icon: Megaphone, title: "Run Sales Promo", body: "Create a discount code" },
  { icon: Bot, title: "Ask Assistant", body: "Get help with your store" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";
  const referralCode = (user?.name || "SABYY").replace(/\s+/g, "").slice(0, 10).toUpperCase();
  const completedTodos = 0;

  return (
    <div className="max-w-350 mx-auto flex flex-col gap-5">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-1">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight mb-1">
            Hello {firstName},
          </h1>
          <p className="text-on-surface-variant text-sm">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg pl-3.5 pr-1.5 py-1.5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]">
          <div className="flex items-center gap-1.5 text-on-surface-variant text-sm">
            <Info size={15} />
            <span>Trial expires in 6 days</span>
          </div>
          <button
            type="button"
            className="bg-primary text-on-primary px-3.5 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-5 auto-rows-[minmax(140px,auto)]">
        {/* Metric cards */}
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="xl:col-span-3 bg-surface-container-lowest rounded-xl p-5 flex flex-col justify-between shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)] hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_6px_20px_rgba(16,24,40,0.08)] transition-shadow"
            >
              <div className="flex items-center gap-2 text-on-surface-variant mb-4">
                <Icon size={16} strokeWidth={1.75} />
                <span className="text-xs uppercase tracking-wider font-medium">
                  {metric.label}
                </span>
              </div>
              <div className="text-[28px] leading-none font-semibold font-mono text-on-surface">
                {metric.value}
              </div>
              <div className="text-xs text-on-surface-variant mt-2">{metric.footer}</div>
            </div>
          );
        })}

        {/* Sales Overview Chart */}
        <div className="xl:col-span-6 xl:row-span-2 bg-surface-container-lowest rounded-xl p-6 flex flex-col shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-semibold text-on-surface">Sales Overview</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Business report is ready.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1.5 text-on-surface-variant hover:bg-surface-container-low rounded-lg border border-outline-variant/60 transition-colors"
              >
                <Download size={16} />
              </button>
              <select className="text-xs font-medium border border-outline-variant/60 rounded-lg bg-surface-container-lowest text-on-surface py-1.5 pl-2.5 pr-7 focus:outline-none focus:border-primary">
                <option>This Year</option>
              </select>
            </div>
          </div>
          <div className="flex-1 relative border-t border-b border-outline-variant/40 flex flex-col justify-center items-center my-2 min-h-60">
            <div className="text-center max-w-sm">
              <LineChart size={28} className="text-on-surface-variant/40 mb-3 mx-auto" strokeWidth={1.5} />
              <h4 className="text-sm font-semibold text-on-surface mb-1.5">No sales data yet</h4>
              <p className="text-xs text-on-surface-variant mb-4">
                Record your first order to start visualizing your business growth.
              </p>
              <button
                type="button"
                className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Record Order
              </button>
            </div>
            <div className="absolute bottom-0 w-full flex justify-between text-[11px] text-on-surface-variant/70 translate-y-full pt-3 px-2">
              {MONTHS.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center gap-6 mt-8 text-xs text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" /> Online Sales
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary" /> Offline Sales
            </div>
          </div>
        </div>

        {/* Store Setup To-do */}
        <div className="xl:col-span-3 xl:row-span-2 bg-surface-container-lowest rounded-xl p-5 flex flex-col shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-base font-semibold text-on-surface">Store Setup</h3>
            <span className="text-xs text-on-surface-variant">{completedTodos}/{TODO_ITEMS.length}</span>
          </div>
          <div className="w-full h-1 bg-surface-container-low rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(completedTodos / TODO_ITEMS.length) * 100}%` }}
            />
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {TODO_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.title}
                  href="#"
                  className="group flex gap-3 items-start p-3 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant shrink-0">
                    <Icon size={16} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-on-surface mb-0.5 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-tight">{item.body}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Onboarding + Mini Metrics */}
        <div className="xl:col-span-3 xl:row-span-2 flex flex-col gap-5">
          <div className="bg-surface-container-lowest rounded-xl p-5 flex-1 flex flex-col justify-center shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]">
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
            {MINI_METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="bg-surface-container-lowest rounded-xl p-3 flex flex-col justify-center items-center text-center cursor-pointer shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)] hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_6px_20px_rgba(16,24,40,0.08)] transition-shadow"
                >
                  <Icon size={18} strokeWidth={1.75} className="text-on-surface-variant mb-1.5" />
                  <span className="text-lg font-semibold text-on-surface">{metric.value}</span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">{metric.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="xl:col-span-6 xl:row-span-2 bg-surface-container-lowest rounded-xl flex flex-col overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]">
          <div className="p-5 border-b border-outline-variant/60 flex justify-between items-center">
            <h3 className="text-base font-semibold text-on-surface">Recent Orders</h3>
            <button type="button" className="text-primary text-sm font-medium hover:underline">
              View Full List
            </button>
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
                <tr>
                  <td className="py-16 text-center" colSpan={4}>
                    <div className="flex flex-col items-center justify-center text-on-surface-variant max-w-sm mx-auto">
                      <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center mb-3">
                        <Package size={22} className="text-on-surface-variant" strokeWidth={1.5} />
                      </div>
                      <p className="text-sm font-medium text-on-surface mb-1">
                        No orders recorded yet
                      </p>
                      <p className="text-xs text-center">
                        When you make sales, they will appear here for easy tracking and fulfillment.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="xl:col-span-3 xl:row-span-2 bg-surface-container-lowest rounded-xl p-5 flex flex-col">
          <h3 className="text-base font-semibold text-on-surface mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-2 flex-1 auto-rows-max">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  type="button"
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
                <p className="text-xs opacity-80 leading-relaxed max-w-50">
                  Help others discover us &amp; earn rewards.
                </p>
              </div>
              <Gift size={22} className="opacity-80" strokeWidth={1.75} />
            </div>
            <div className="mt-auto bg-white/10 rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Your Code</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-widest">{referralCode}</span>
                <button type="button" className="p-1 hover:bg-white/10 rounded transition-colors">
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

          <div className="bg-surface-container-lowest rounded-xl p-5 flex-1 flex flex-col items-center justify-center text-center shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]">
            <h3 className="text-sm font-medium text-on-surface mb-3 self-start w-full text-left">
              Top Sales Channel
            </h3>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-3">
              <BarChart3 size={18} strokeWidth={1.75} />
            </div>
            <p className="text-xs text-on-surface-variant mb-3">
              Not enough data to determine top channels.
            </p>
            <button type="button" className="text-primary text-xs font-medium hover:underline">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
