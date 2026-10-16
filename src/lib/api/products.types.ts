// Mirrors oniraja-server src/modules/products and the `products`,
// `product_variants` and `categories` tables.

export type Category = {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  imageUrl: string | null;
  isActive: boolean;
  hasVariants: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductVariant = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  priceKobo: number;
  /** Omitted by the backend for the staff role. */
  costKobo?: number;
  /** Basis points, 750 = 7.5% VAT. null = no tax. */
  taxRateBps: number | null;
  attributes: Record<string, unknown> | null;
  weightKg: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductWithVariants = Product & { variants: ProductVariant[] };

export type ListProductsQuery = {
  page?: number;
  limit?: number;
  categoryId?: string;
  isActive?: boolean;
  search?: string;
};

export type CreateCategoryRequest = {
  name: string;
  parentId?: string;
};

export type CreateProductRequest = {
  name: string;
  description?: string;
  categoryId?: string;
  imageUrl?: string;
};

export type UpdateProductRequest = {
  name?: string;
  description?: string | null;
  categoryId?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
};

export type CreateVariantRequest = {
  sku: string;
  name: string;
  priceKobo: number;
  costKobo?: number;
  taxRateBps?: number;
  /** JSON-encoded object, e.g. '{"size":"M"}'. */
  attributes?: string;
};

export type UpdateVariantRequest = {
  name?: string;
  priceKobo?: number;
  costKobo?: number;
  taxRateBps?: number | null;
  attributes?: string | null;
  isActive?: boolean;
};
