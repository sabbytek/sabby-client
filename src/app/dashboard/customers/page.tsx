"use client";

import { useState } from "react";
import { Plus, User, Users, Mail, UserPlus, Search, ShieldCheck } from "lucide-react";
import { Guard, WRITE_ROLES, useHasRole } from "@/components/auth/guard";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState, Skeleton, TableSkeletonRows, UpgradeNotice } from "@/components/ui/states";
import { CONSENT_SOURCE_LABELS, CustomerFormModal } from "@/components/dashboard/customers/customer-form-modal";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCustomers } from "@/lib/queries/customers.queries";
import { errorMessage, isFeatureGated } from "@/lib/api/types";
import { formatCount, formatDate } from "@/lib/format";
import type { Customer } from "@/lib/api/customers.types";

const CARD_SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]";

const TABS = ["Customers", "Customer Groups", "Newsletter"] as const;
type Tab = (typeof TABS)[number];

// No backend endpoints exist for these yet.
const UNAVAILABLE_TABS: Record<Exclude<Tab, "Customers">, { icon: typeof User; title: string; body: string }> = {
  "Customer Groups": {
    icon: Users,
    title: "Customer groups are coming soon",
    body: "You'll be able to group customers by location, spend, or loyalty to target them better.",
  },
  Newsletter: {
    icon: Mail,
    title: "Newsletter is coming soon",
    body: "Subscribers will receive your store updates and promotions.",
  },
};

const COLUMNS = ["Name", "Phone", "Email", "NDPR Consent", "Added"];

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Customers");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  const canWrite = useHasRole(WRITE_ROLES);
  const debouncedSearch = useDebouncedValue(search.trim());

  const customers = useCustomers({ page, limit, search: debouncedSearch || undefined });
  const allCustomers = useCustomers({ page: 1, limit: 1 });

  const items = customers.data?.items ?? [];
  const gated = isFeatureGated(customers.error);

  const addButton = (
    <button
      type="button"
      onClick={() => setIsCreateOpen(true)}
      className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
    >
      <Plus size={16} />
      Add New Customer
    </button>
  );

  return (
    <div className="max-w-350 mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Customers</h1>
        <Guard role={WRITE_ROLES}>{addButton}</Guard>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className={`bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between ${CARD_SHADOW}`}>
          <div>
            <div className="text-[26px] leading-none font-semibold font-mono text-on-surface mb-2">
              {allCustomers.isLoading ? (
                <Skeleton className="h-6.5 w-12" />
              ) : allCustomers.error ? (
                "—"
              ) : (
                formatCount(allCustomers.data?.total)
              )}
            </div>
            <div className="text-xs text-on-surface-variant">Total Customers</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant shrink-0">
            <User size={18} strokeWidth={1.75} />
          </div>
        </div>
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

      {activeTab !== "Customers" ? (
        <div className={`bg-surface-container-lowest rounded-xl ${CARD_SHADOW}`}>
          <EmptyState {...UNAVAILABLE_TABS[activeTab]} />
        </div>
      ) : (
        <div className={`bg-surface-container-lowest rounded-xl overflow-hidden ${CARD_SHADOW}`}>
          <div className="p-4 border-b border-outline-variant/40">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, phone or email"
                className="text-sm pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64"
              />
            </div>
          </div>

          {customers.error && !customers.data ? (
            gated ? (
              <UpgradeNotice feature="Customer management" />
            ) : (
              <ErrorState message={errorMessage(customers.error)} onRetry={() => void customers.refetch()} />
            )
          ) : !customers.isLoading && items.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title={debouncedSearch ? "No customers match your search" : "Add customers to your contact list"}
              body={debouncedSearch ? "Try a different name, phone number or email." : "Customers you add or sell to will show up here."}
              action={!debouncedSearch && canWrite ? addButton : undefined}
            />
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-150">
                <thead>
                  <tr className="text-xs text-on-surface-variant border-b border-outline-variant/40 bg-surface-container-low/40">
                    {COLUMNS.map((col) => (
                      <th key={col} className="py-3 px-5 font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={customers.isFetching && !customers.isLoading ? "opacity-60 transition-opacity" : undefined}>
                  {customers.isLoading ? (
                    <TableSkeletonRows columns={COLUMNS.length} />
                  ) : (
                    items.map((c) => (
                      <tr
                        key={c.id}
                        onClick={canWrite ? () => setEditing(c) : undefined}
                        className={`text-sm border-b border-outline-variant/30 last:border-0 transition-colors ${
                          canWrite ? "hover:bg-surface-container-low/50 cursor-pointer" : ""
                        }`}
                      >
                        <td className="py-3 px-5 font-medium text-on-surface">
                          {[c.firstName, c.lastName].filter(Boolean).join(" ")}
                        </td>
                        <td className="py-3 px-5 text-on-surface-variant">{c.phone || "—"}</td>
                        <td className="py-3 px-5 text-on-surface-variant">{c.email || "—"}</td>
                        <td className="py-3 px-5">
                          {c.consentGivenAt ? (
                            <span
                              className="inline-flex items-center gap-1 text-xs font-medium text-success"
                              title={c.consentSource ? CONSENT_SOURCE_LABELS[c.consentSource] : undefined}
                            >
                              <ShieldCheck size={14} /> {formatDate(c.consentGivenAt)}
                            </span>
                          ) : (
                            <span className="text-xs text-on-surface-variant">Not recorded</span>
                          )}
                        </td>
                        <td className="py-3 px-5 text-on-surface-variant">{formatDate(c.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            page={page}
            totalPages={customers.data?.totalPages ?? 0}
            total={customers.data?.total ?? 0}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(n) => {
              setLimit(n);
              setPage(1);
            }}
            isFetching={customers.isFetching}
          />
        </div>
      )}

      <CustomerFormModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <CustomerFormModal
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        customer={editing}
      />
    </div>
  );
}
