"use client";

import { useState } from "react";
import {
  Settings,
  ChevronDown,
  Plus,
  ShoppingBag,
  ClipboardCheck,
  FileWarning,
  RotateCcw,
  Filter,
  Truck,
  Calendar,
  Search,
  PackageOpen,
} from "lucide-react";

const CARD_SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]";

const STATS = [
  { label: "Total Orders", value: "0", icon: ShoppingBag },
  { label: "Completed Orders", value: "0", icon: ClipboardCheck },
  { label: "Unpaid Orders", value: "0", icon: FileWarning },
];

const STATUS_FILTERS = ["Paid", "Partially Paid", "Pending", "Unpaid", "All"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const TABLE_COLUMNS = [
  "Order Number & Name",
  "Total",
  "Status",
  "Payment",
  "Shipping",
  "Date",
  "Downloads",
];

export default function OrdersPage() {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("All");

  return (
    <div className="max-w-350 mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Orders</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-on-surface px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
          >
            Actions
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus size={16} />
            Create Order
          </button>
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <Settings size={17} />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between ${CARD_SHADOW}`}
            >
              <div>
                <div className="text-[26px] leading-none font-semibold font-mono text-on-surface mb-2">
                  {stat.value}
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
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeStatus === status
                ? "bg-primary text-on-primary"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table container */}
      <div className={`bg-surface-container-lowest rounded-xl overflow-hidden ${CARD_SHADOW}`}>
        {/* Toolbar */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-outline-variant/40">
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <RotateCcw size={15} />
            Showing 0 of 0 Orders
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <Filter size={14} />
              Filter
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <Truck size={14} />
              Delivery
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <Calendar size={14} />
              Select Date Range
            </button>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search"
                className="text-sm pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary w-40"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
            <thead>
              <tr className="text-xs text-on-surface-variant border-b border-outline-variant/40 bg-surface-container-low/40">
                <th className="py-3 px-5 w-10">
                  <input type="checkbox" className="rounded border-outline-variant/60 accent-primary" />
                </th>
                {TABLE_COLUMNS.map((col) => (
                  <th key={col} className="py-3 px-5 font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-16 text-center" colSpan={TABLE_COLUMNS.length + 1}>
                  <div className="flex flex-col items-center justify-center text-on-surface-variant">
                    <PackageOpen size={40} className="text-on-surface-variant/50 mb-3" strokeWidth={1.5} />
                    <p className="text-sm font-medium text-on-surface">No record found</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="p-4 border-t border-outline-variant/40 flex items-center gap-2 text-sm text-on-surface-variant">
          Show
          <select className="text-sm border-0 rounded-lg bg-surface-container-low text-on-surface py-1 pl-2 pr-6 focus:outline-none focus:ring-1 focus:ring-primary">
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          Entries
        </div>
      </div>
    </div>
  );
}
