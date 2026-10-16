import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  createProduct,
  createVariant,
  getProduct,
  listCategories,
  listProducts,
} from "@/lib/api/products.api";
import { listInventory, receiveStock } from "@/lib/api/inventory.api";
import type {
  CreateCategoryRequest,
  CreateProductRequest,
  CreateVariantRequest,
  ListProductsQuery,
} from "@/lib/api/products.types";

export const productKeys = {
  all: ["products"] as const,
  list: (query: ListProductsQuery) => ["products", "list", query] as const,
  detail: (id: string) => ["products", "detail", id] as const,
  categories: ["products", "categories"] as const,
};

export const inventoryKeys = {
  all: ["inventory"] as const,
};

export function useProducts(query: ListProductsQuery) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => listProducts(query),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string | null) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ""),
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({ queryKey: productKeys.categories, queryFn: listCategories });
}

export function useInventory() {
  return useQuery({ queryKey: inventoryKeys.all, queryFn: () => listInventory() });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCategoryRequest) => createCategory(body),
    onSuccess: () => {
      // Refetch in the background; awaiting it would keep the mutation pending until every list reloads.
      void queryClient.invalidateQueries({ queryKey: productKeys.categories });
    },
  });
}

/**
 * Creates the product, then its first variant (price lives on variants), then
 * optionally receives opening stock at the variant's first location. Later
 * steps failing leave the earlier records in place; the error says so.
 */
export function useCreateProductWithVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      product,
      variant,
      openingStock,
    }: {
      product: CreateProductRequest;
      variant: CreateVariantRequest;
      openingStock?: number;
    }) => {
      const created = await createProduct(product);
      let variantId: string;
      try {
        variantId = (await createVariant(created.id, variant)).id;
      } catch (err) {
        const reason = err instanceof Error ? err.message : "unknown error";
        throw new Error(`Product "${created.name}" was created, but its price/SKU wasn't saved: ${reason}`);
      }
      if (openingStock && openingStock > 0) {
        try {
          // The backend creates an inventory row per active location for new variants.
          const [level] = await listInventory({ variantId });
          if (!level) throw new Error("no stock location found");
          await receiveStock({
            variantId,
            locationId: level.locationId,
            quantity: openingStock,
            note: "Opening stock",
          });
        } catch (err) {
          const reason = err instanceof Error ? err.message : "unknown error";
          throw new Error(`Product "${created.name}" was created, but its opening stock wasn't saved: ${reason}`);
        }
      }
      return created;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
      void queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}
