"use client";

import { useState } from "react";
import { ChevronDown, Plus, User, Users, Mail, UserPlus } from "lucide-react";

const CARD_SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]";

const STATS = [
  { label: "Total Customers", value: "0", icon: User },
  { label: "Customer groups", value: "0", icon: Users },
  { label: "Newsletter Subscribers", value: "0", icon: Mail },
];

const TABS = ["Customers", "Customer Groups", "Newsletter"] as const;
type Tab = (typeof TABS)[number];

const EMPTY_STATE: Record<Tab, { icon: typeof User; title: string; body: string; cta: string }> = {
  Customers: {
    icon: UserPlus,
    title: "Add customers to your contact list",
    body: "You can add a new customer or import your contacts.",
    cta: "Add Customers",
  },
  "Customer Groups": {
    icon: Users,
    title: "Organize customers into groups",
    body: "Group customers by location, spend, or loyalty to target them better.",
    cta: "Create Group",
  },
  Newsletter: {
    icon: Mail,
    title: "Grow your newsletter list",
    body: "Subscribers here will receive your store updates and promotions.",
    cta: "Add Subscribers",
  },
};

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Customers");
  const empty = EMPTY_STATE[activeTab];
  const EmptyIcon = empty.icon;

  return (
    <div className="max-w-350 mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Customers</h1>
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
            Add New Customer
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
          <EmptyIcon size={28} strokeWidth={1.5} />
        </div>
        <h2 className="text-base font-semibold text-on-surface mb-1.5">{empty.title}</h2>
        <p className="text-sm text-on-surface-variant mb-6">{empty.body}</p>
        <button
          type="button"
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          {empty.cta}
        </button>
      </div>
    </div>
  );
}
