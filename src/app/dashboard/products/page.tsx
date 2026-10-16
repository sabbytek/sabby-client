"use client";

import { useMemo, useState } from "react";
import { Plus, Banknote, Package, PackageX, AlertTriangle, Layers, Search, Lock } from "lucide-react";
import { Guard, MANAGER_ROLES, useHasRole } from "@/components/auth/guard";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState, Skeleton, TableSkeletonRows } from "@/components/ui/states";
import { CreateProductModal } from "@/components/dashboard/products/create-product-modal";
import { CreateCategoryModal } from "@/components/dashboard/products/create-category-modal";
import { ProductDetailModal } from "@/components/dashboard/products/product-detail-modal";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCategories, useInventory, useProducts } from "@/lib/queries/products.queries";
import { useInventoryValuation } from "@/lib/queries/reports.queries";
import { errorMessage, isFeatureGated } from "@/lib/api/types";
import { formatCount, formatDate, formatKobo } from "@/lib/format";

const CARD_SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]";

const TABS = ["Products", "Categories"] as const;
type Tab = (typeof TABS)[number];

const PRODUCT_COLUMNS = ["Product", "Category", "Status", "Added"];

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Products");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const isManager = useHasRole(MANAGER_ROLES);
  const debouncedSearch = useDebouncedValue(search.trim());

  const products = useProducts({
    page,
    limit,
    search: debouncedSearch || undefined,
    categoryId: categoryId || undefined,
  });
  const allProducts = useProducts({ page: 1, limit: 1 });
  const categories = useCategories();
  const inventory = useInventory();
  // Cost data: only fetched for owner/manager, and plan-gated by the backend.
  const valuation = useInventoryValuation(isManager);

  const stock = useMemo(() => {
    let out = 0;
    let low = 0;
    for (const row of inventory.data ?? []) {
      if (row.quantityOnHand <= 0) out += 1;
      else if (row.quantityOnHand <= row.lowStockThreshold) low += 1;
    }
    return { out, low };
  }, [inventory.data]);

  const categoryNames = useMemo(
    () => new Map((categories.data ?? []).map((c) => [c.id, c.name])),
    [categories.data],
  );

  const valuationValue = !isManager
    ? null
    : valuation.isLoading
      ? undefined
      : valuation.error
        ? isFeatureGated(valuation.error)
          ? "locked"
          : null
        : formatKobo(valuation.data?.totalValueKobo);

  const stats = [
    {
      label: "Total Products",
      value: allProducts.isLoading ? undefined : formatCount(allProducts.data?.total),
      icon: Package,
    },
    { label: "Inventory Value (at cost)", value: valuationValue, icon: Banknote },
    { label: "Low Stock", value: inventory.isLoading ? undefined : formatCount(stock.low), icon: AlertTriangle },
    { label: "Out of Stock", value: inventory.isLoading ? undefined : formatCount(stock.out), icon: PackageX },
  ];

  const hasFilters = !!(debouncedSearch || categoryId);
  const items = products.data?.items ?? [];

  const addProductButton = (
    <button
      type="button"
      onClick={() => setIsCreateOpen(true)}
      className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
    >
      <Plus size={16} />
      Add New Product
    </button>
  );

  return (
    <div className="max-w-350 mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-on-surface tracking-tight">Products</h1>
        <Guard role={MANAGER_ROLES}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-on-surface px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
            >
              <Layers size={15} />
              New Category
            </button>
            {addProductButton}
          </div>
        </Guard>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between ${CARD_SHADOW}`}
            >
              <div>
                <div className="text-[26px] leading-none font-semibold font-mono text-on-surface mb-2">
                  {stat.value === undefined ? (
                    <Skeleton className="h-6.5 w-16" />
                  ) : stat.value === "locked" ? (
                    <span className="flex items-center gap-1.5 text-sm font-sans font-medium text-on-surface-variant">
                      <Lock size={14} /> Upgrade to see
                    </span>
                  ) : (
                    (stat.value ?? "—")
                  )}
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

      {activeTab === "Products" ? (
        <div className={`bg-surface-container-lowest rounded-xl overflow-hidden ${CARD_SHADOW}`}>
          {/* Toolbar */}
          <div className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between border-b border-outline-variant/40">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products"
                className="text-sm pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-56"
              />
            </div>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
              aria-label="Category"
              className="text-sm font-medium text-on-surface-variant pl-3 pr-7 py-1.5 rounded-lg bg-surface-container-low focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All categories</option>
              {(categories.data ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {products.error && !products.data ? (
            <ErrorState message={errorMessage(products.error)} onRetry={() => void products.refetch()} />
          ) : !products.isLoading && items.length === 0 ? (
            <EmptyState
              icon={Package}
              title={hasFilters ? "No products match your search" : "Add new products to your store"}
              body={hasFilters ? "Try a different name or category." : "Products you add will show up here."}
              action={!hasFilters && isManager ? addProductButton : undefined}
            />
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-150">
                <thead>
                  <tr className="text-xs text-on-surface-variant border-b border-outline-variant/40 bg-surface-container-low/40">
                    {PRODUCT_COLUMNS.map((col) => (
                      <th key={col} className="py-3 px-5 font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={products.isFetching && !products.isLoading ? "opacity-60 transition-opacity" : undefined}>
                  {products.isLoading ? (
                    <TableSkeletonRows columns={PRODUCT_COLUMNS.length} />
                  ) : (
                    items.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedId(p.id)}
                        className="text-sm border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-low/50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-5 font-medium text-on-surface">{p.name}</td>
                        <td className="py-3 px-5 text-on-surface-variant">
                          {(p.categoryId && categoryNames.get(p.categoryId)) || "—"}
                        </td>
                        <td className="py-3 px-5">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              p.isActive ? "bg-success-bg text-success" : "bg-surface-container-high text-on-surface-variant"
                            }`}
                          >
                            {p.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-on-surface-variant">{formatDate(p.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            page={page}
            totalPages={products.data?.totalPages ?? 0}
            total={products.data?.total ?? 0}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(n) => {
              setLimit(n);
              setPage(1);
            }}
            isFetching={products.isFetching}
          />
        </div>
      ) : (
        <div className={`bg-surface-container-lowest rounded-xl overflow-hidden ${CARD_SHADOW}`}>
          {categories.isLoading ? (
            <table className="w-full">
              <tbody>
                <TableSkeletonRows columns={2} rows={3} />
              </tbody>
            </table>
          ) : categories.error ? (
            <ErrorState message={errorMessage(categories.error)} onRetry={() => void categories.refetch()} />
          ) : (categories.data ?? []).length === 0 ? (
            <EmptyState
              icon={Layers}
              title="Group your products into categories"
              body="Categories help customers browse related products together."
              action={
                isManager ? (
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(true)}
                    className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Plus size={16} />
                    Create Category
                  </button>
                ) : undefined
              }
            />
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-on-surface-variant border-b border-outline-variant/40 bg-surface-container-low/40">
                  <th className="py-3 px-5 font-medium">Category</th>
                  <th className="py-3 px-5 font-medium">Parent</th>
                  <th className="py-3 px-5 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {categories.data!.map((c) => (
                  <tr key={c.id} className="border-b border-outline-variant/30 last:border-0">
                    <td className="py-3 px-5 font-medium text-on-surface">{c.name}</td>
                    <td className="py-3 px-5 text-on-surface-variant">
                      {(c.parentId && categoryNames.get(c.parentId)) || "—"}
                    </td>
                    <td className="py-3 px-5 text-on-surface-variant">{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <ProductDetailModal productId={selectedId} onClose={() => setSelectedId(null)} />
      <CreateProductModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <CreateCategoryModal open={isCategoryOpen} onOpenChange={setIsCategoryOpen} />
    </div>
  );
}
