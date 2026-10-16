import { request } from "@/lib/api/_transport";
import { emptyPage, type ApiPaginated } from "@/lib/api/types";
import type {
  Category,
  CreateCategoryRequest,
  CreateProductRequest,
  CreateVariantRequest,
  ListProductsQuery,
  Product,
  ProductVariant,
  ProductWithVariants,
  UpdateProductRequest,
  UpdateVariantRequest,
} from "@/lib/api/products.types";

export function listProducts(query: ListProductsQuery = {}): Promise<ApiPaginated<Product>> {
  return request<ApiPaginated<Product>>({
    path: "/v1/products",
    method: "GET",
    query,
    mock: emptyPage(query.page, query.limit),
  });
}

export function getProduct(id: string): Promise<ProductWithVariants> {
  return request<ProductWithVariants>({ path: `/v1/products/${encodeURIComponent(id)}`, method: "GET" });
}

export function createProduct(body: CreateProductRequest): Promise<Product> {
  return request<Product>({ path: "/v1/products", method: "POST", body });
}

export function updateProduct(id: string, body: UpdateProductRequest): Promise<Product> {
  return request<Product>({ path: `/v1/products/${encodeURIComponent(id)}`, method: "PATCH", body });
}

export function createVariant(productId: string, body: CreateVariantRequest): Promise<ProductVariant> {
  return request<ProductVariant>({
    path: `/v1/products/${encodeURIComponent(productId)}/variants`,
    method: "POST",
    body,
  });
}

export function updateVariant(
  productId: string,
  variantId: string,
  body: UpdateVariantRequest,
): Promise<ProductVariant> {
  return request<ProductVariant>({
    path: `/v1/products/${encodeURIComponent(productId)}/variants/${encodeURIComponent(variantId)}`,
    method: "PATCH",
    body,
  });
}

export function listCategories(): Promise<Category[]> {
  return request<Category[]>({ path: "/v1/products/categories", method: "GET", mock: [] });
}

export function createCategory(body: CreateCategoryRequest): Promise<Category> {
  return request<Category>({ path: "/v1/products/categories", method: "POST", body });
}
