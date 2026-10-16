"use client";

import { useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import { ErrorState, Skeleton } from "@/components/ui/states";
import { useCategories, useInventory, useProduct } from "@/lib/queries/products.queries";
import { errorMessage } from "@/lib/api/types";
import { formatDate, formatKobo } from "@/lib/format";

type Props = { productId: string | null; onClose: () => void };

export function ProductDetailModal({ productId, onClose }: Props) {
  const { data: product, isLoading, error, refetch } = useProduct(productId);
  const { data: inventory } = useInventory();
  const { data: categories } = useCategories();

  const stockByVariant = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of inventory ?? []) {
      map.set(row.variantId, (map.get(row.variantId) ?? 0) + row.quantityOnHand);
    }
    return map;
  }, [inventory]);

  const categoryName = categories?.find((c) => c.id === product?.categoryId)?.name;
  // The backend strips costKobo for the staff role.
  const showCost = product?.variants.some((v) => v.costKobo !== undefined) ?? false;

  return (
    <Modal
      open={!!productId}
      onOpenChange={(open) => !open && onClose()}
      title={product?.name ?? "Product"}
      description={product ? `Added ${formatDate(product.createdAt)}${categoryName ? ` · ${categoryName}` : ""}` : undefined}
      width="max-w-xl"
    >
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : error || !product ? (
        <ErrorState message={errorMessage(error, "Product not found")} onRetry={() => void refetch()} />
      ) : (
        <div className="flex flex-col gap-4">
          {product.description && <p className="text-sm text-on-surface-variant">{product.description}</p>}
          {product.variants.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No variants yet, so this product has no price.</p>
          ) : (
            <div className="rounded-lg border border-outline-variant/50 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-on-surface-variant bg-surface-container-low/50 text-left">
                    <th className="py-2 px-3 font-medium">Variant</th>
                    <th className="py-2 px-3 font-medium">SKU</th>
                    <th className="py-2 px-3 font-medium text-right">Price</th>
                    {showCost && <th className="py-2 px-3 font-medium text-right">Cost</th>}
                    <th className="py-2 px-3 font-medium text-right">In stock</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <tr key={v.id} className={`border-t border-outline-variant/30 ${v.isActive ? "" : "opacity-50"}`}>
                      <td className="py-2 px-3">{v.name}</td>
                      <td className="py-2 px-3 font-mono text-xs">{v.sku}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatKobo(v.priceKobo)}</td>
                      {showCost && <td className="py-2 px-3 text-right font-mono">{formatKobo(v.costKobo)}</td>}
                      <td className="py-2 px-3 text-right">{stockByVariant.get(v.id) ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
