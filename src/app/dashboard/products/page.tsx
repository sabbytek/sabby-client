"use client";

import { useState } from "react";
import {
  HelpCircle,
  Settings,
  ChevronDown,
  Plus,
  Download,
  Banknote,
  Package,
  Tag,
  PackageX,
  Layers,
} from "lucide-react";

const CARD_SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]";

const STATS = [
  { label: "Total Retail Value", value: "₦0.00", icon: Banknote },
  { label: "Total Inventory Value", value: "₦0.00", icon: Package },
  { label: "Products Sold", value: "0", icon: Tag },
  { label: "Out of Stock", value: "0", icon: PackageX },
];

const TABS = ["Products", "Collections"] as const;
type Tab = (typeof TABS)[number];

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Products");

  return (
    <div className="max-w-350 mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Products</h1>
          <HelpCircle size={16} className="text-on-surface-variant" />
        </div>
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
            className="flex items-center gap-1.5 text-sm font-medium text-on-surface px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
          >
            History
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus size={16} />
            Add New Product
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* Tabs */}
      <div className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-surface-container-low text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className={`bg-surface-container-lowest rounded-xl p-16 flex flex-col items-center justify-center text-center ${CARD_SHADOW}`}>
        <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-5">
          {activeTab === "Products" ? (
            <Package size={28} strokeWidth={1.5} />
          ) : (
            <Layers size={28} strokeWidth={1.5} />
          )}
        </div>
        <h2 className="text-base font-semibold text-on-surface mb-1.5">
          {activeTab === "Products"
            ? "Add new products to your store"
            : "Group your products into collections"}
        </h2>
        <p className="text-sm text-on-surface-variant mb-6">
          {activeTab === "Products"
            ? "Choose how you want to add products"
            : "Collections help customers browse related products together"}
        </p>

        {activeTab === "Products" ? (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium text-primary px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <Download size={16} />
              Import Products
            </button>
            <button
              type="button"
              className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              Add New Product
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Create Collection
          </button>
        )}
      </div>
    </div>
  );
}
