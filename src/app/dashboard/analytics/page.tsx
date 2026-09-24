"use client";

import { useState } from "react";
import { Download, Calendar, ChevronDown, Menu } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const CARD_SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]";
const DATE_RANGE = "Jan 1, 2026 - Dec 31, 2026";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FLAT_ZERO_DATA = MONTHS.map((month) => ({ month, value: 0 }));

const TABS = ["Sales", "Transactions", "Products", "Customers", "Campaigns"] as const;
type Tab = (typeof TABS)[number];

const SALES_METRICS = [
  "Total Sales",
  "Shipping Spend",
  "Net Profit",
  "Expenses",
  "Gross Profit",
  "Offline Sales",
  "Discount Given",
  "Online Sales",
];

function ChartCard({ label }: { label: string }) {
  return (
    <div className={`bg-surface-container-lowest rounded-xl p-5 ${CARD_SHADOW}`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm text-on-surface-variant">{label}</span>
        <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {DATE_RANGE}
        </span>
      </div>
      <div className="text-2xl font-semibold text-on-surface mb-4">₦0.00</div>
      <div className="relative h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={FLAT_ZERO_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#ccc3d8" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#4a4455" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 1]}
              tick={{ fontSize: 11, fill: "#4a4455" }}
              axisLine={false}
              tickLine={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#630ed4"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <button
          type="button"
          className="absolute top-0 right-0 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <Menu size={16} />
        </button>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Sales");

  return (
    <div className="max-w-350 mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Analytics</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-surface-container-low pl-3.5 pr-1.5 py-1.5 rounded-lg">
            <span className="text-sm text-on-surface-variant whitespace-nowrap">
              Business report is ready.
            </span>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-on-primary hover:opacity-90 transition-opacity"
            >
              <Download size={14} />
            </button>
          </div>
          <span className="text-sm font-medium text-on-surface whitespace-nowrap">
            Select date to filter:
          </span>
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-on-surface px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors whitespace-nowrap"
          >
            <Calendar size={14} />
            {DATE_RANGE}
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-on-surface px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
          >
            Compare
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Sub-nav tabs */}
      <div className="flex items-center gap-6 border-b border-outline-variant/40">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {SALES_METRICS.map((metric) => (
            <ChartCard key={metric} label={metric} />
          ))}
        </div>
      ) : (
        <div className={`bg-surface-container-lowest rounded-xl p-16 flex flex-col items-center justify-center text-center ${CARD_SHADOW}`}>
          <p className="text-sm text-on-surface-variant">
            No {activeTab.toLowerCase()} data yet. Once you have activity, insights will show up here.
          </p>
        </div>
      )}
    </div>
  );
}
